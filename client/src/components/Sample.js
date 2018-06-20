import React, { Component } from 'react';
import axios from 'axios';

class Sample extends Component {
    constructor(){
        super();
        this.state = {
            list: [],
            item: '',
            id: '',
            edit: false,
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
    }

    componentDidMount() {
        this.refresh();
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e){
        e.preventDefault();

        const newItem = {
            item: this.state.item,
            id: this.state.id,
            date: Date.now()
        }

        if(!newItem.id) {
            delete newItem.id;
        }

        axios.put('/api/Todos', newItem)
            .then(res => this.refresh())
            .catch(err => console.log(err));
    }

    onClickEdit(element){
        this.setState({
            item: element.item,
            id: element.id,
            edit: true
        });
    }
    
    onClickCancel(){
        this.setState({
            item: '',
            id: '',
            edit: false
        });
    }

    onClickDelete(element){
        axios.delete(`/api/Todos/${element.id}`)
            .then(res => this.refresh())
            .catch(err => console.log(err));
    }
    
    refresh(){
        axios.get('/api/Todos')
            .then(res =>
                this.setState(
                {
                    list: res.data,
                    item: '',
                    id: '',
                    edit: false
                }, console.log(this.state.list)
            ))
            .catch(err => console.log(err));
    }

    render() {

        const { list } = this.state;
        const contents = list.map(element => (
            <div
                style={{border: '1px solid #777', maxWidth: '500px', margin: 'auto'}}
                key={element.id}>
                    {element.item}
                <div>
                    <button onClick={() => this.onClickEdit(element)}>Edit</button>
                    <button onClick={() => this.onClickDelete(element)}>Delete</button>
                </div>
            </div>)
        );

        return (
            <div>
                <h2>CRUD Sample</h2>
                <form onSubmit={this.onSubmit}>
                    <input type="text"
                        name="item"
                        placeholder="New Todo Item"
                        value={this.state.item}
                        onChange={this.onChange}
                    />
                    <input type="submit" value="Submit" />
                    {this.state.edit ? (<button onClick={this.onClickCancel}>Cancel</button>) : null}
                </form>
                <div>
                    <h4>Todo List</h4>
                    <div>
                        { contents }
                    </div>
                </div>
            </div>
        );
    }
}

export default Sample;