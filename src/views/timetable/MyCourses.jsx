import React, { Component } from 'react';
import Title from './Title.jsx';
import TableData from './TableData.jsx';
import './MyCourses.css';

class MyCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      color: {},
      section: "section-A"
    };

    this.fetchData = this.fetchData.bind(this);
  }

  handleHTTPErrors = (response) => {
    if (!response.ok) throw Error(response.status +
      ': ' + response.statusText);
    return response;
  }

  componentDidMount() {
    fetch(`https://my-json-server.typicode.com/a-bishop/timetable-server-${this.state.section}/Courses`)
      .then(response => this.handleHTTPErrors(response))
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.setState({
          courses: result,
          display: {},
          color: {}
        });
        this.state.courses.forEach((course) => {
          let hash = this.hashCode(course.Course);
          let color = this.colorGenerator(hash);
          let courseId = course.ID;
          this.setState({
            color: { ...this.state.color, [courseId]: color }
          })
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchData(e) {
    this.setState({
      section: e.target.value
    }, () => {
      fetch(`https://my-json-server.typicode.com/a-bishop/timetable-server-${this.state.section}/Courses`)
        .then(response => this.handleHTTPErrors(response))
        .then(response => response.json())
        .then(result => {
          console.log(result);
          this.setState({
            courses: result,
            display: {},
            color: {}
          });
        })
        .catch(error => {
          console.log(error);
        });
    })
  }

  render() {
    let section = <p className="sectionTitle">----</p>;
    if (this.state.section === "section-A") {
      section = <p className="sectionTitle">Section A</p>
    } else if (this.state.section === "section-B") {
      section = <p className="sectionTitle">Section B</p>
    } else if (this.state.section === "section-C") {
      section = <p className="sectionTitle">Section C</p>
    }
    return (
      <div className='myCourses'>
        <Title />
        <div className='sectionSelectors'>
          <span><button onClick={this.fetchData} value="section-A">Section A</button></span>
          <span> <button onClick={this.fetchData} value="section-B">Section B</button></span>
          <span> <button onClick={this.fetchData} value="section-C">Section C</button></span>
        </div>
        {section}
        <div className='timetable'>
          <section className='timeWrapper'>
            <div>8:00</div>
            <div>9:00</div>
            <div>10:00</div>
            <div>10:30</div>
            <div>11:30</div>
            <div>12:30</div>
            <div>1:30</div>
            <div>2:30</div>
            <div>3:30</div>
            <div>4:00</div>
            <div>5:00</div>
            <div>6:00</div>
          </section>
          <section className='titleWrapper'>
            <p className='timeColumn'>TIME</p>
            <p className='monday'>MON</p>
            <p className='tuesday'>TUE</p>
            <p className='wednesday'>WED</p>
            <p className='thursday'>THU</p>
            <p className='friday'>FRI</p>
            <p className='saturday'>SAT</p>
          </section>
          {this.state.courses.map(course =>
            <TableData
              key={course.ID}
              id={course.ID}
              color={this.state.color[course.ID]}
              course={course.Course}
              type={course.Type}
              day={course.Day}
              startTime={course.StartTime}
              endTime={course.EndTime}
              room={course.Room}
            />
          )}
        </div>
      </div>
    )
  }
}

export default MyCourses;