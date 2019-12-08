import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.getName = this.getName.bind(this);

    this.state = {
      nickname: '',
      note: '',
      allNotes: [],
    };

  }

  componentDidMount() {
    console.log(Object.entries(localStorage));
    this.setState({
      // Is an array with with arrays, 0 for key, 1 for value
      allNotes: Object.entries(localStorage),
    },
    () => {
      console.log('setting state with new data: ', this.state.allNotes);
    })
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log(name);
    
    this.setState({
      [name]: value
    }, () => {
      console.log('changed state: ', this.state);
      // if name already in storage then update also the value for it

      if (name === 'nickname' && localStorage.getItem(this.state.nickname)) {
        const savedFromBefore = localStorage.getItem(this.state.nickname);
        if (savedFromBefore) {
          console.log('saved from before: ', savedFromBefore);
          this.setState({
            note: savedFromBefore,
          });
        } else {
          console.log('saved from before with different nickname');
          this.setState({
            note: '',
          });
        }
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if(this.state.nickname.length < 1) return;
    if(this.state.note.length < 1) return;

    console.log('state on submit: ', this.state);
    if (this.state.nickname && this.state.note) {
      // If exists in local storage then add to it

      localStorage.setItem(this.state.nickname, this.state.note);

    }
    this.setState({
      nickname: '',
      note: '',
    }, () => {
      let localData = Object.entries(localStorage);
      console.log('localData', localData);
      let sortedArray = localData.sort((a, b) => {
        return b[0] - a[0];
      });
      console.log('sortedArray', sortedArray);

      this.setState({
        // Is an array with with arrays, 0 for key, 1 for value
        allNotes: sortedArray,
      });
    });
  }

  getName(e) {
    console.log('changed state123: ', e.target.innerText);
    this.setState({ nickname: e.target.innerText }, () => {
      const dataForClick = localStorage.getItem(this.state.nickname);
      this.setState({ note: dataForClick });
      console.log(dataForClick);
    });
  }

  removeItem(e) {
    localStorage.removeItem(e.target.parentElement.childNodes[0].innerText);
    let localData = Object.entries(localStorage);
    console.log('localData', localData);
    let sortedArray = localData.sort((a, b) => {
      // return b[0] - a[0];
      a[0].localeCompare(b[0]);
    });
    console.log('sortedArray', sortedArray);

    this.setState({
      // Is an array with with arrays, 0 for key, 1 for value
      allNotes: sortedArray,
    });
  }

  render() {
    return (
      <div>
        <form>
          <label>
            Enter users nickname:
            <input
              name="nickname"
              type="text"
              onChange={this.handleChange}
              value={this.state.nickname}
            />
          </label>
          <br />
          <label>
            Note:
            <textarea
              name="note"
              value={this.state.note}
              onChange={this.handleChange}
            />
          </label>
          <button type="submit" onClick={this.handleSubmit}>Save</button>
        </form>
        <ul>
          {this.state.allNotes.map((villain, i) => {
          return <li key={`${villain[0]}${i}`} className="li_item"><span className="villain" onClick={this.getName}>{villain[0]}</span>: {villain[1]} <span onClick={this.removeItem} className='delete'>X</span></li>
            })
          }
        </ul>
      </div>
    )
  }
}
