import React, {Component} from 'react';
import {Button, Container} from 'react-bootstrap';
import axios from 'axios';
import Loader from 'react-loader-spinner'
import LoadingOverlay from 'react-loading-overlay';
import CircleLoader from 'react-spinners/BounceLoader'

import OPZIONI from './Body/opzioni';
import SCANFILE from './Body/scanned_files';
import OUTWORK from './Body/out_work';
import ACTIONS from './Body/actions';
import ALERT from './Body/alert';

import './App.css';


axios.interceptors.request.use( request =>{
  /** 
   * Qui è possibile editare qualsiasi request in uscita
   * ad esempio aggiungere headers variable 
   * */ 
  let token = localStorage.getItem('token');
  if(token)
    request.headers['x-access-token'] =  token;

   return (request)
}, error => {
  /** 
   * Qui è possibile gestire centralmente tutti gli errori
   * in spedizione di requests
   */


   // Rimando il controllo al componente locale
   return Promise.reject(error);
})

axios.interceptors.response.use( response =>{
  /**
   * Qui è possibile editare qualsiasi response in entrata
   * */ 



   return (response)
}, error => {
  /** 
   * Qui è possibile gestire centralmente tutti gli errori
   * in ricezione di response
   */

   
   // Rimando il controllo al componente locale

})



class App extends Component {

  state = {
    opzioni : {
      Formato:"tiff",
      Risoluzione: 150,
      Colore:"Gray",
      Profondita:8,
    },
    alert : {
      variant:"info",
      heading:"Titolo",
      text:"Testo",
      show:false
    },
    files : [],
    bigFiles:false,
    scanning:false,
    text : "Elaborazione in corso",
    filePDF:"",
    stdView:true
  }

  files=[];


  changeOpzione = (formData) =>{
    this.setState({opzioni:formData})
  }

  setbigFiles= (size)=>{
    let stato=false;

    if(size > 1024 * 1024 * 10){
      stato=true;
      let alert = {
        variant:"info",
        heading:"Max file size",
        text:"Attenzione, la dimensione dei file scansionati è troppo grande per essere inviata via email. L'invio email viene disattivato. Salvare su NAS.",
        show:true            
      }
      let statoAttuale = this.state.alert;
      if(!statoAttuale.show)
        this.setState({alert:alert})        
    }
    
    if(this.state.bigFiles !== stato)
      this.setState({bigFiles:stato})
  }

  changeStdView = (flag) => { this.setState({stdView:flag})}

  closeAlert = () =>{ 
    let alert = this.state.alert;
    alert.show=false;    
    this.setState({aler:alert},console.log(this.state))
  }

  nomePdfFile = (nome) => { this.setState({filePDF:nome})}

  componentDidMount() {

    this.getFileList()
    .then(files => {
      this.setState({files:files})
      var last = document.getElementById("lastFileScanned");
      var alert = document.getElementById("myAlert");
  
      
      if(alert)
          alert.scrollIntoView();   
      else{
          if(last) 
            last.scrollIntoView();    
      }  
    })    

  }

  getFileList = () => {
    return new Promise ((fulfill, reject) => {
      axios.post('/localExec',{cmd : "ls -l tmpScannedFiles | awk '{print $5"+'":"'+"$9}'"})
      .then( result => {        
        let list = result.data.data.split("\n")
        let fileList = list.splice(1, list.length-2);     // Romuovo il primo elemento e l'ultimo
        let files = fileList.map( f => {
          let s = f.split(':');
          return {'dimensione':s[0],'nome':s[1]}
        })
        fulfill(files)
      })
      .catch(error => console.log(error))
    })     
  }


  scan = () =>{

      let fileName=Math.floor(Date.now()/1000)+"."+this.state.opzioni.Formato;
      this.files=this.state.files;
      
      this.setState({scanning:true, text:"Scansione documento in corso"})

      let scncmd = "scanimage --format="+this.state.opzioni.Formato+
                    " --mode="+this.state.opzioni.Colore+
                    " --depth="+this.state.opzioni.Profondita+
                    " --resolution="+this.state.opzioni.Risoluzione+
                    " > ./tmpScannedFiles/"+fileName
    

    return new Promise ((fulfill, reject) => {
      axios.post('/localExec',{cmd : scncmd})
      .then( result => {
          if(result){
            this.files.push({"nome":fileName,"dimensione":0});
            this.setState({files:this.files})
            return this.getFileList()
          }
          let alert = {
              variant:"danger",
              heading:"Errore Scansione",
              text:"Errore nella scansione del documento",
              show:true            
          }
          this.setState({alert:alert})
          this.setState({scanning:false})
      })

      .then(result => {
        this.setState({files:result,scanning:false})
        fulfill(result)
      })

      .catch(error => {
        this.setState({scanning:false})
        let alert = {
          variant:"danger",
          heading:"Errore Scansione",
          text:"Errore nella scansione del documento "+error,
          show:true            
        }
        this.setState({alert:alert})
      })
    }) 
    
  }

  startNew = () =>{

    this.setState({scanning:true, text:"Cancellazione file in corso"});
    return new Promise ((fulfill, reject) => {
      let files = this.state.files.map(f =>  f.nome)
      console.log(files)
      axios.post('/localExec',{cmd : "./cancella.sh "+files.toString().replace(/,/g," ")})
      .then( result => {
        let files = result.data.data.split("\n")
        this.files=[];
        this.setState({files:this.files, scanning:false})        
        fulfill(files)
      })
      .catch(error => {
        let alert = {
          variant:"warning",
          heading:"Errore Cancellazione file",
          text:"Errore nella cancellazione dei file "+error,
          show:true            
      }
      this.setState({alert:alert,scanning:false})    
      })
    })        
  }

  saveToDisk = () => {

    this.setState({scanning:true, text:"Copia dei file sul NAS"});

    return new Promise ((fulfill, reject) => {
      axios.post('/localExec',{cmd : "cp  ./tmpScannedFiles/* /ScanDoc"})
      .then( result => {
        console.log(result);
        this.setState({scanning:false});
      })
      .catch(error => {
        let alert = {
          variant:"danger",
          heading:"Errore conversione PDF",
          text:"Errore nella conversione in PDF "+error,
          show:true            
        }
        this.setState({alert:alert,scanning:false})          
      })
    })      
  }

  copy = () => {
    console.log("[Copy]")
    this.scan()
    .then( result => {
      this.setState({scanning:true, text:"stampa documento in corso"})
      return this.stampa(this.state.files[0].nome)
    })
    .then ( () => {
      console.log("Fine stampa, cancello files!")
      return this.startNew()
    })
    .then ( () => {console.log("Copia conclusa")})
    .catch(error => {
      let alert = {
        variant:"danger",
        heading:"Errore Copia",
        text:"Errore nella Copia documento "+error,
        show:true            
      }
      this.setState({alert:alert,scanning:false})          
    })    
  }

  stampa = (documento) => {
    return new Promise ((fulfill, reject) => {
      let cmd = "lp ./tmpScannedFiles/"+documento+" -o fit-to-page"
      if(this.state.opzioni.Colore === "Color")
        cmd += " -o colormode=color"
      axios.post('/localExec',{cmd : cmd})
      .then( result => {
        this.setState({scanning:false});
        fulfill(result)
      })
      .catch(error => {
        let alert = {
          variant:"danger",
          heading:"Errore stampa documento",
          text:"Errore durante la stampa del documento "+error,
          show:true            
        }
        this.setState({alert:alert,scanning:false})     
        reject(error);     
      })
    })   
  }

  convertToPDF = () => {

    if(!this.state.filePDF)
    {
      let alert = {
        variant:"warning",
        heading:"Nome file",
        text:"Inserire il nome del file PDF ",
        show:true            
      }
      this.setState({alert:alert,scanning:false})   
      return    
    }

    if(this.state.files.length === 0)
    {
      let alert = {
        variant:"warning",
        heading:"Missing Files",
        text:"Non ci sono files da convertire in PDF ",
        show:true            
      }
      this.setState({alert:alert,scanning:false})   
      return    
    }


    this.setState({scanning:true, text:"Conversione in PDF"});

    let fileToConvert = this.state.files
    .filter(f => {return f.nome.length > 0})
    .map(f => { return ("./tmpScannedFiles/"+f.nome)})
    
    return new Promise ((fulfill, reject) => {
      axios.post('/localExec',{cmd : "img2pdf "+fileToConvert.toString().replace(/,/g," ")+" -o ./tmpScannedFiles/"+this.state.filePDF})
      .then( result => {
        return this.startNew()        
      })
      .then (result => {
        this.setState({scanning:false, files:[this.state.filePDF]})
        return this.getFileList()
      })
      .then(result => {
        this.setState({files:result,scanning:false})
        fulfill(result)
      })      
      .catch(error => {
        let alert = {
          variant:"danger",
          heading:"Errore conversione PDF",
          text:"Errore nella conversione in PDF "+error,
          show:true            
        }
        this.setState({alert:alert,scanning:false})          
      })
    })  
  }


  sendEmail = (recipient) => {

    this.setState({scanning:true, text:"Invio email"});

    let filesAttachments = this.state.files
    .filter(f => {return f.length > 0})
    .map(f => {
      return( {filename : f, path : './tmpScannedFiles/'+f})
    })

    return new Promise ((fulfill, reject) => {
      axios.post('/email',{ emailTo:recipient, 
                            emailFrom:"scanner <expovin@me.com>", 
                            emailSubject:"Invio scannerizzazione documenti",
                            emailBody:"Ivio scannerizzazione documenti in allegato",
                            emailAttachments:filesAttachments})
      .then( result => {
        this.setState({scanning:false});
        fulfill(result)
      })
      .catch(error => {
        let alert = {
          variant:"warning",
          heading:"Errore invio email",
          text:"Errore nell'invio email' "+error,
          show:true            
        }
        this.setState({alert:alert,scanning:false})           
      })
    })  
  }
  

  commandPage = () =>{
    return(
      <Container>
        <ALERT alert={this.state.alert} closeAlert={this.closeAlert}/>
        <OPZIONI changeOpzione={this.changeOpzione} numFile={this.state.files.length}/>
        <SCANFILE scan={this.scan} 
                  fileList = {this.state.files}
                  convertToPDF = {this.convertToPDF}
                  setbigFiles={this.setbigFiles}
                  copy={this.copy}/>
        <OUTWORK nomePdfFile={this.nomePdfFile}/>
        <ACTIONS sendEmail={this.sendEmail}
                 changeStdView={this.changeStdView}
                 stdView={this.state.stdView}
                 saveToDisk={this.saveToDisk}
                 bigFiles={this.state.bigFiles}
                 bigFiles={this.state.bigFiles}/>
        
        <Container>
          <Button variant="warning" size="lg" onClick={this.startNew} block> Nuovo Lavoro </Button>
        </Container>

      </Container>
    )
  }

  spinner = () =>{
    return(
      <div id="waitSpinner">
          <h4> Attendere fine scannerizzazione</h4>
          <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
      </div>
    )
  }
    
  render(){
    return( 

      <LoadingOverlay
      active={this.state.scanning}
      text={this.state.text}
      spinner={<CircleLoader />}>
        {this.commandPage()}
      </LoadingOverlay>
    )
  }
}

export default App;
