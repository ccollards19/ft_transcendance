import React from "react";
import "./styles.css";

export default class Stopper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stoper: 0,
      paused: false
    };
  }

  tick() {
    this.setState({ stoper: this.state.stoper + 1 });
  }

  componentDidMount() {
    this.myTimerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myTimerID);
  }

  reset() {
    this.setState({ stoper: 0 });
  }

  pause() {
    if (this.state.paused === true) {
      this.myTimerID = setInterval(() => this.tick(), 1000);
      this.setState({ paused: false });
    } else {
      clearInterval(this.myTimerID);
      this.setState({ paused: true });
    }
  }

  formatTimer() {
    const { stoper } = this.state;
    let timer = "Time: ";
    if (stoper < 60) {
      timer += stoper + " s";
    } else {
      let minutes = Math.floor(stoper / 60);
      let seconds = stoper % 60;
      timer += minutes + " m " + seconds + " s";
    }
    return timer;
  }

  render() {
    return <div className="timer">{this.formatTimer()}</div>;
  }
}
