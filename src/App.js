import React from 'react';
import { createWorker } from 'tesseract.js';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Scan from './pages/Scan'

registerPlugin(FilePondPluginImagePreview);



class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isProcessing : false,
            ocrText : '',
            pctg : '0.00'
        }
        this.pond = React.createRef();
        this.worker = React.createRef();
        this.updateProgressAndLog = this.updateProgressAndLog.bind(this);
    }


    async doOCR(file) {
        this.setState({
            isProcessing : true,
            ocrText : '',
            pctg : '0.00'
        })
        await this.worker.load();
        await this.worker.loadLanguage('eng');
        await this.worker.initialize('eng');
        const { data: { text } } = await this.worker.recognize(file.file);
        this.setState({
            isProcessing : false,
            ocrText : text
        })
    };
    updateProgressAndLog(m){
        var MAX_PARCENTAGE = 1 ;
        var DECIMAL_COUNT = 2 ;

        if(m.status === "recognizing text"){
            var pctg = (m.progress / MAX_PARCENTAGE) * 100
            this.setState({
                pctg : pctg.toFixed(DECIMAL_COUNT)
            })

        }
    }
    componentDidMount(){
        this.worker = createWorker({
            logger: m => this.updateProgressAndLog(m),
        });

    }
    render() {
        return (
            <div className="App">
                <div className = "scan__header">
                    <h1>Gist </h1>
                </div>


                <div className = "App__body">
                <div className="container">
                    <div style={{marginTop : "10%"}} className="row">
                        <div className="col-md-4">   

                        </div>
                        <div className="col-md-4">
                            <FilePond ref={ref => this.pond = ref}
                                onaddfile={(err,file) =>{
                                    this.doOCR(file);

                                }}
                                onremovefile={(err,fiile) =>{
                                    this.setState({
                                        ocrText : ''
                                    })
                                }}
                                />
                        </div>
                        <div className="col-md-4">

                        </div>
                    </div>
                    <div className="card">
                        <h5 className="card-header">
                            <div style={{margin : "1%", textAlign: "left"}} className="row">
                                <div className="col-md-12">
                                    <center><i className={"fas fa-sync fa-2x " + (this.state.isProcessing ? "fa-spin" : "")}></i> <span className="status-text">{this.state.isProcessing ? `Processing Image ( ${this.state.pctg} % )` : ""} </span></center>
                                </div>

                            </div>

                        </h5>
                        <div class="card-body">
                            <p class="card-text">{(this.state.isProcessing) ?
                                    '...........'
                                    : this.state.ocrText.length === 0 ? "Please Upload a File or Scan Image" : this.state.ocrText }</p>
                            </div>
                        </div>


                        <div className="ocr-text">

                        </div>
                    </div>
                    
                </div>
                {/* <div className = "scan__button">
                    <a><h4>Start</h4></a>
                </div> */}
                
                    {/* <Scan/> */}

                </div>
            );}
        }

        export default App;
