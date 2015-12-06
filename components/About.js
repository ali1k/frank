import React from 'react';

class About extends React.Component {
    render() {
        return (
            <div className="ui page grid" ref="about">
              <div className="ui row">
                <div className="column">
                    <div className="ui segment content">
                        <h2 className="ui header">About</h2>
                        <div>
                            This dataset contains data about the events prof. <a href="http://www.cs.vu.nl/~frankh/">Frank van Harmelen</a> has attended so far.<br/>
                            You can download RDF dumps from <a href="https://github.com/ali1k/frank/tree/master/rdf_dump">here</a>.
                            The interface is powered by <a href="http://ld-r.org">LD-R framework</a>. <br/>
                            <div className="blue ui card item">
                              <div className="content">
                                <div className="header"><a href="http://vu.nl" target="_blank"><img className="ui centered medium image" src="/assets/img/VU_logo.png" /></a></div>
                                <div className="meta"><a href="http://www.networkinstitute.org/" target="_blank">Department of Computer Science  & <br/> The Network Institute</a></div>
                                <div className="description">
                                    VU University Amsterdam <br/>
                                 de Boelelaan 1081a<br/> 1081HV Amsterdam<br/> The Netherlands <br/>
                                 </div>
                              </div>
                          </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default About;
