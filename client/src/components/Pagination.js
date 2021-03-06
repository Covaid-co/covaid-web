import React from "react";

const Pagination = ({ postsPerPage, totalPosts, paginate, currPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  function paginatePages(event, number) {
    event.preventDefault();
    paginate(number);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={number === currPage ? "page-item active" : "page-item"}
          >
            <a
              onClick={(e) => paginatePages(e, number)}
              href="!#"
              className="page-link"
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
