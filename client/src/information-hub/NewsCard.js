import React from "react";

export default function NewsCard(props) {
   
    return (
        <div>
          <a href={props.article.url}>{props.article.title}</a>
        </div>
    );
};