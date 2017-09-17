import React, { Component } from 'react';
import Profile from './people/Profile';
import Feed from './feed/Feed';
import ArticleTile from './feed/ArticleTile';

class ProfileColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      personIsLoading: false,
      personNotFound: false,
      person: null,
      itemsIsLoading: false,
      items: null,
    }
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(e.target.url.value);
    const name = e.target.url.value;
    this.setState({
      name: name,
      personIsLoading: true,
      personNotFound: false,
      person: null,
      itemsIsLoading: true,
      items: null,
    });
    this.props.repo.getProfile(name).then(person => {
      this.setState({
        personIsLoading: false,
        person: person,
      });
      this.props.repo.getPosts(person).then(articles => {
        this.setState({
          itemsIsLoading: false,
          items: articles.map(a => <ArticleTile article={a} key={a.title}/>),
        });
      }).catch(e => {
        console.error(e);
        this.setState({
          itemsIsLoading: false,
        })
      });
    }).catch(e => {
      console.error(e);
      this.setState({
        personIsLoading: false,
        personNotFound: true,
        itemsIsLoading: false,
      });
    });
  }

  render() {
    return (
        <div className="profileColumn">
          <form onSubmit={this.onSubmit.bind(this)} >
            <input type="text" className="input" name="url" placeholder="Enter a person's name..." />
          </form>
          <Profile notFound={this.state.personNotFound} isLoading={this.state.personIsLoading} person={this.state.person} />
          <Feed isLoading={this.state.itemsIsLoading} items={this.state.items} />
        </div>
    );
  }
}

export default ProfileColumn;