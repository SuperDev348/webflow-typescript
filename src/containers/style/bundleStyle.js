import styled from "styled-components";

export const Styles = styled.div`
  .bundle {
    .listing {
      column-count: 1;
    }
    
    .listing > * {
      -webkit-column-break-inside: avoid !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      text-overflow: ellipsis;
      white-space: break-spaces;
      overflow: hidden;
    }
    
    @media screen and (min-width: 30em) {
      .listing {
        column-count: 2;
      }
    }
    
    @media screen and (min-width: 48em) {
      .listing {
        column-count: 2;
      }
    }
    
    @media screen and (min-width: 62em) {
      .listing {
        column-count: 3;
      }
    }
    
    @media screen and (min-width: 80em) {
      .listing {
        column-count: 4;
      }
    }
    
    .listing-compact > * {
      -webkit-column-break-inside: avoid !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      text-overflow: ellipsis;
      white-space: break-spaces;
      overflow: hidden;
    }
    
    @media screen and (min-width: 62em) {
      .listing-compact {
        columns: 350px 3;
      }
    }
    
    .anchor {
      position: relative;
      top: -66px; /* offset by nav heightbar + 0.5rem */
    }
    
    .searchresult:hover .searchresult__underline {
      text-decoration: underline;
    }
    
    @media screen and (min-width: 48em) {
      .toc {
        position: sticky;
        top: 88px;
        overflow: scroll;
        max-height: calc(100vh - 88px);
        padding-bottom: 2rem;
        overflow-scrolling: touch;
        -webkit-overflow-scrolling: touch;
      }
    }
    
    .toc__contents ul {
      margin-left: 0.5rem;
      list-style: none;
    }
    
    .toc__contents li > ul > li > ul {
      margin-top: 0.25rem;
    }
    
    .toc__contents li.active > a {
      color: #335cb3;
    }
    .toc__contents li.active-parent > a {
      color: #335cb3;
    }    
  }
`;