import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';


import Websocket from 'react-websocket';


class RemoteWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [],
      rowData: []
    };
  }

  getHandlerUrl() {
    return document.getElementById("root").dataset.handler;
  }

  handleData(data) {
    let result = JSON.parse(data);
    switch (result.message) {
      case "columns":
        this.setState({columnDefs: result.value});
        break;
      case "rows":
        this.setState(state => {
          const list = state.rowData.concat(result.value);
          return {
            columnDefs: state.columnDefs,
            rowData: list};
        });
        break;
    }
    this.setState({count: this.state.count + result.movement});
    console.log(result);
  }

  render() {
    return (
      <div>
        <Websocket url={this.getHandlerUrl()} onMessage={this.handleData.bind(this)}/>
        <div
          className="ag-theme-balham"
          style={{
          height: '500px',
          width: '100%' }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}>
          </AgGridReact>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <br/>
      <Container>
        <Row>
          <Col>
            <RemoteWidget />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
