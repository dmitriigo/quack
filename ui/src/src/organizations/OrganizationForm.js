import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import * as Utils from '../common/Utils';


class OrganizationForm extends Component {


    constructor(props) {
        super(props);
        this.state = {
             organization: {
                 id: null,
                 name: "",
                 description: "",
                 allowedGroups: [],
                 allowedUsers: [],
                 admins: []
             }
         };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleChange(event) {
        var organizationUpd = this.state.organization;
        organizationUpd[event.target.name] = event.target.value;
        if (event.target.name == "name"){
            organizationUpd.id = this.normalizeId(event.target.value);
        }
        const newState = Object.assign({}, this.state, {
          organization: organizationUpd
        });
        this.setState(newState);
      }

      handleSubmit(event) {
        axios.post('/api/organization', this.state.organization)
        .then(response => {
            this.props.history.push('/organizations/' + response.data.id);
        }).catch((error) => {
            Utils.onErrorMessage("Couldn't save organization: ", error)
        });
        event.preventDefault();
      }

    componentDidMount() {
        if (this.props.id){
            axios
              .get("/api/organization/" + this.props.id)
              .then(response => {
                const newState = Object.assign({}, this.state, {
                  organization: response.data
                });
                this.setState(newState);
              }).catch(error => {
                Utils.onErrorMessage("Couldn't get organization: ", error);
              });
        }
     }

    normalizeId(id){
        return id.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
    }

    render() {
        return (
            <div>
                <h1>Create Organization</h1>
                <form>
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Name</label>
                      <div className="col-sm-10">
                        <input type="text" name="name" value={this.state.organization.name} onChange={this.handleChange} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Organization ID</label>
                      <div className="col-sm-10">
                        <input type="text" name="id" value={this.state.organization.id || ""} onChange={this.handleChange} />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Description</label>
                      <div className="col-sm-10">
                        <input type="text" name="description" value={this.state.organization.description} onChange={this.handleChange} />
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Create</button>
                </form>
            </div>
        );
      }

}

export default withRouter(OrganizationForm);
