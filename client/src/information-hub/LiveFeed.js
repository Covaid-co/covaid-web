import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';

import Pusher from "pusher-js";

import NewsCard from './NewsCard';

class LiveFeed extends Component {
    state = {
      newsItems: [],
    }

    componentDidMount() {
        fetch('http://localhost:5000/api/news/live')
          .then(response => response.json())
          .then(articles => {
            this.setState({
                newsItems: [...this.state.newsItems, ...articles],
              });
          }).catch(error => console.log(error));

        var pusher = new Pusher("ed72954a8d404950e3c8", {
            cluster: "us2",
            forceTLS: true,
        });
        var channel = pusher.subscribe('news-channel');
        channel.bind('update-news', data => {
            this.setState({
                newsItems: [...data.articles, ...this.state.newsItems],
              });
        });
    }
    render() {
            return (
                <>
                    <Container
                        id="newOfferContainer"
                        style={{ display: "block", marginTop: 10, overflowY: "scroll", height: 150 }}
                    >
                        <h5
                            id="volunteer-offer-status"
                            style={{ fontSize: 24, fontWeight: "bold", color: "black" }}
                        >
                            Live COVID-19 News (WIP)
                        </h5>
                        {this.state.newsItems.map((article, i) => {
                            return (
                                <NewsCard key={i} article={article} />
                                );
                            })
                        }
                    </Container>
                </>
            );
    }
};

export default LiveFeed;