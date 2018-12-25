import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import CreatableSelect from 'react-select/lib/Creatable';
import $ from 'jquery';

class LaunchForm extends SubComponent {
    constructor(props) {
        super(props);
        this.state = {
             launch: {
                 name: "",
                 testSuite: {filter: {}},
                 properties: []
             }
         };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleChange(event) {
        this.state.launch[event.target.name] = event.target.value;
        this.setState(this.state);
      }

      handleSubmit(event) {
        this.state.launch.testSuite.filter.filters = (this.state.launch.testSuite.filter.filters || []).
            filter(function(filter){return filter.id !== undefined && filter.id !== null});
        this.state.launch.testSuite.filter.filters.forEach(function(filter){
            delete filter.title;
        })
        axios.post('/api/' + this.props.match.params.project + '/launch/', this.state.launch)
        .then(response => {
            this.state.launch = response.data;
            this.setState(this.state);
        })
        event.preventDefault();
      }

    componentWillReceiveProps(nextProps) {
      if(nextProps.filter){
        this.state.launch.testSuite.filter = nextProps.filter;
      }
      if(nextProps.launch){
          this.state.launch = nextProps.launch;
      }
      this.setState(this.state);
    }

    componentDidMount() {
        super.componentDidMount();
    }

    render() {
        let modalBody;
        if (this.state.launch.id){
            modalBody = <div className="modal-body" id="launch-created">
                            Launch created
                        </div>
        } else {
            modalBody =
                <div className="modal-body" id="launch-creation-form">
                    <form>
                      <label>
                        Name:
                        <input type="text" name="name" onChange={this.handleChange} />
                      </label>
                    </form>
                </div>
        }


        return (
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="editAttributeLabel">Attribute</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div>{modalBody}</div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Create Launch</button>
                  </div>
                </div>
             </div>
        );
      }


}

export default withRouter(LaunchForm);