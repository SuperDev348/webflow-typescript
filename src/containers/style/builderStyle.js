import styled from "styled-components";

export const Styles = styled.div`
  .builder {
    .dragging {
      z-index: 111 !important;
    }
    .block {
      position: absolute;
      z-index: 9;
    }
    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 60px;
      background-color: #217ce8;
      margin-top: -5px;
      opacity: 1;
      transition: all 0.3s cubic-bezier(0.05, 0.03, 0.35, 1);
      transform: scale(1);
      position: absolute;
      z-index: 2;
    }
    .invisible {
      opacity: 0 !important;
      transform: scale(0);
    }
    .indicator:after {
      content: '';
      display: block;
      width: 12px;
      height: 12px;
      background-color: #217ce8;
      transform: scale(1.7);
      opacity: 0.2;
      border-radius: 60px;
    }
    .arrowblock {
      position: absolute;
      width: 100%;
      overflow: visible;
      pointer-events: none;
    }
    .arrowblock svg {
      width: -webkit-fill-available;
      overflow: visible;
    }
    
    .App-logo {
      height: 40vmin;
      pointer-events: none;
    }
    
    @media (prefers-reduced-motion: no-preference) {
      .App-logo {
        animation: App-logo-spin infinite 20s linear;
      }
    }
    
    .App-header {
      background-color: #282c34;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: calc(10px + 2vmin);
      color: white;
    }
    
    .App-link {
      color: #61dafb;
    }
    
    @keyframes App-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    #navigation {
      height: 71px;
      background-color: #fff;
      border: 1px solid #e8e8ef;
      width: 100%;
      display: table;
      box-sizing: border-box;
      position: fixed;
      top: 0;
      z-index: 9;
    }
    #back {
      width: 40px;
      height: 40px;
      border-radius: 100px;
      text-align: center;
      display: inline-block;
      vertical-align: top;
      margin-top: 12px;
      margin-right: 10px;
    }
    #back img {
      margin-top: 6px;
    }
    #names {
      display: inline-block;
      vertical-align: top;
    }
    #title {
      font-family: Roboto;
      font-weight: 500;
      font-size: 16px;
      color: #393c44;
      margin-bottom: 0px;
    }
    #subtitle {
      font-family: Roboto;
      color: #808292;
      font-size: 14px;
      margin-top: 5px;
    }
    #leftside {
      display: inline-flex;
      justify-content: space-between;
      vertical-align: middle;
      margin-left: 20px;
      width: 338px;
    }
    #details :hover {
      cursor: pointer;
    }
    #centerswitch {
      position: absolute;
      /* width: 222px; */
      left: 50%;
      margin-left: -345px;
      top: 15px;
    }
    #leftswitch {
      border: 1px solid #e8e8ef;
      background-color: #fbfbfb;
      width: 280px;
      height: 39px;
      line-height: 39px;
      border-radius: 5px 0px 0px 5px;
      font-family: Roboto;
      color: #393c44;
      display: inline-block;
      font-size: 14px;
      text-align: center;
      margin-right: 4px;
    }
    #rightswitch {
      font-family: Roboto;
      color: #808292;
      border-radius: 0px 5px 5px 0px;
      border: 1px solid #e8e8ef;
      height: 39px;
      width: 145px;
      display: inline-block;
      font-size: 14px;
      line-height: 39px;
      text-align: center;
      margin-left: -5px;
    }
    #discard {
      font-family: Roboto;
      font-weight: 500;
      font-size: 14px;
      color: #a6a6b3;
      width: 95px;
      height: 38px;
      border: 1px solid #e8e8ef;
      border-radius: 5px;
      text-align: center;
      line-height: 38px;
      display: inline-block;
      vertical-align: top;
      transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
    }
    #discard:hover {
      cursor: pointer;
      opacity: 0.7;
    }
    #publish {
      font-family: Roboto;
      font-weight: 500;
      font-size: 14px;
      color: #fff;
      background-color: #217ce8;
      border-radius: 5px;
      width: 143px;
      height: 38px;
      margin-left: 10px;
      display: inline-block;
      vertical-align: top;
      text-align: center;
      line-height: 38px;
      margin-right: 20px;
      transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
      text-decoration: none;
    }
    #publish:hover {
      cursor: pointer;
      opacity: 0.7;
    }
    #buttonsright {
      float: right;
      margin-top: 15px;
    }
    #leftcard {
      height: 100%;
      width: fixed;
      padding-right: 20px;
      background-color: #fff;
      border: 1px solid #e8e8ef;
      box-sizing: border-box;
      border-bottom: none;
      padding-left: 20px;
      position: absolute;
      z-index: 2;
    }
    #search input {
      width: 318px;
      height: 40px;
      background-color: #fff;
      border: 1px solid #e8e8ef;
      box-sizing: border-box;
      box-shadow: 0px 2px 8px rgba(34, 34, 87, 0.05);
      border-radius: 5px;
      text-indent: 35px;
      font-family: Roboto;
      font-size: 16px;
    }
    ::-webkit-input-placeholder {
      /* Edge */
      color: #c9c9d5;
    }
    
    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #c9c9d5;
    }
    
    ::placeholder {
      color: #c9c9d5;
    }
    #search img {
      position: absolute;
      margin-top: 10px;
      width: 18px;
      margin-left: 12px;
    }
    #header {
      font-size: 20px;
      font-family: Roboto;
      font-weight: bold;
      color: #393c44;
    }
    #subnav {
      border-bottom: 1px solid #e8e8ef;
      width: calc(100% + 20px);
      margin-left: -20px;
      margin-top: 10px;
    }
    .navdisabled {
      transition: all 0.3s cubic-bezier(0.05, 0.03, 0.35, 1);
    }
    .navdisabled:hover {
      cursor: pointer;
      opacity: 0.5;
    }
    .navactive {
      color: #393c44 !important;
    }
    #triggers {
      margin-left: 20px;
      font-family: Roboto;
      font-weight: 500;
      font-size: 14px;
      text-align: center;
      color: #808292;
      width: calc(88% / 3);
      height: 48px;
      line-height: 48px;
      display: inline-block;
      float: left;
    }
    .navactive:after {
      display: block;
      content: '';
      width: 100%;
      height: 4px;
      background-color: #217ce8;
      margin-top: -4px;
    }
    #actions {
      display: inline-block;
      font-family: Roboto;
      font-weight: 500;
      color: #808292;
      font-size: 14px;
      height: 48px;
      line-height: 48px;
      width: calc(88% / 3);
      text-align: center;
      float: left;
    }
    #loggers {
      width: calc(88% / 3);
      display: inline-block;
      font-family: Roboto;
      font-weight: 500;
      color: #808292;
      font-size: 14px;
      height: 48px;
      line-height: 48px;
      text-align: center;
    }
    #footer {
      position: fixed;
      left: 0;
      padding-left: 20px;
      line-height: 40px;
      bottom: 0;
      width: 362px;
      border: 1px solid #e8e8ef;
      height: 67px;
      box-sizing: border-box;
      background-color: #fff;
      font-family: Roboto;
      font-size: 14px;
    }
    #footer a {
      text-decoration: none;
      color: #393c44;
      transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
    }
    #footer a:hover {
      opacity: 0.5;
    }
    #footer span {
      color: #808292;
    }
    #footer p {
      display: inline-block;
      color: #808292;
    }
    #footer img {
      margin-left: 5px;
      margin-right: 5px;
    }
    .rightcard {
      width: 318px;
    }
    .blockelem {
      padding-top: 10px;
      /* width: 318px; */
      border: 1px solid transparent;
      transition-property: box-shadow, height;
      transition-duration: 0.2s;
      transition-timing-function: cubic-bezier(0.05, 0.03, 0.35, 1);
      border-radius: 5px;
      box-shadow: 0px 0px 30px rgba(22, 33, 74, 0);
      box-sizing: border-box;
    }
    .blockelem:first-child {
      margin-top: 10px;
    }
    .blockelem:hover {
      box-shadow: 0px 4px 30px rgba(22, 33, 74, 0.08);
      border-radius: 5px;
      background-color: #fff;
      cursor: grab;
    }
    .grabme,
    .blockico {
      display: inline-block;
    }
    .grabme {
      margin-top: 10px;
      width: 15px;
    }
    .condition {
      display: flex;
      margin-bottom: 15px;
      border-color: white;
    }
    .condition img {
      width: 20px;
      margin-right: 12px;
    }
    .condition button {
      width: calc(100% - 37px);
      justify-content: start;
      border-color: white;
    }
    .condition input {
      width: 120px;
    }
    .branch {
      display: flex;
      margin-bottom: 15px;
    }
    .branch img {
      width: 20px;
      margin-right: 12px;
      color: white;
    }
    .branch button {
      width: calc(100% - 32px);
    }
    .addprotocol {
      width: 401px;
      border: 1px solid lightgray;
      padding: 5px;
    }
    .branchlist {
      display: flex;
      margin-bottom: 15px;
      height: 24px;
    }
    .branchlist img {
      width: 24px;
      margin-right: 12px;
    }
    .branchlist .crossbutton {
      margin-right: -15px;
      margin-left: -15px;
    }
    .selectgroup {
      display: inline-flex;
      margin-top: 15px;
    }
    .selectfilter {
      display: inline-flex;
      margin-top: 15px;
    }
    .select-condition {
      width: 100%;
      display: inline-flex;
      margin-top: 15px;
      align-items: center;
    }
    .selectgroup * {
      margin-right: -1px;
      border-radius: 0px;
      margin-bottom: 4px;
    }
    .selectgroup input {
      width: 85px;
      border: 1px solid lightgray;
      margin-left: 8px;
    }
    .selectgroup svg {
      margin: 0;
    }
    .selectgroup > :first-child {
      /* margin-right: 5px; */
      display: inline-flex;
      align-items: center;
    }
    /* .selectgroup > :last-child {
      margin-right: 16px;
    } */
    .selectgroup button {
      margin-left: 8px;
    }
    .conditioninput {
      border: 1px solid lightgray;
      height: 32px !important;
    }
    .conditioninput :focus {
      outline: none;
      border: 0px solid #217ce8 !important;
    }
    .filterlist {
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: center;
      padding: 0px;
    }
    .addfilter-static {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 60px;
    }
    .addfilterstatic {
      margin-right: 5px;
      width: 60px;
      /* justify-content: center; */
    }
    .addfilterselect {
      margin-left: 8px;
      height: 100%;
    }
    .addfilterselect input {
      display: none;
      width: 100%;
    }
    .addfilterinput {
      height: auto !important;
    }
    .filterinput {
      width: 55px !important;
    }
    .branchinput {
      border: 1px solid lightgray;
    }
    .periodinput {
      width: 201px;
      border: 1px solid #ccc;
      margin-right: 1px;
    }
    .globalinput {
      height: 36px;
      border: 1px solid #cdcdcd;
      font-size: 18px;
      margin-top: 5px;
      margin-bottom: 10px;
      padding: 5px;
    }
    .buttonaddfilter {
      text-transform: initial;
    }
    #blocklist {
      height: 100%;
      overflow: auto;
    }
    #proplist {
      width: 100%;
      min-height: 500px;
      padding-left: 16px;
      padding-right: 16px;
    }
    .proplist {
      width: 100%;
      min-height: 500px;
      padding-left: 16px;
      padding-right: 16px;
    }
    .evidencelist {
      width: 100%;
      padding-left: 16px;
      padding-right: 16px;
    }
    .blockin {
      padding-left: 10px;
      padding-right: 10px;
      display: inline-block;
      vertical-align: top;
    }
    .blockico {
      margin: 0px;
      padding: 0px;
      padding-top: 4px;
      width: 36px;
      height: 36px;
      background-color: #f1f4fc;
      border-radius: 5px;
      text-align: center;
      white-space: nowrap;
    }
    .blockico span {
      height: 100%;
      width: 0px;
      display: inline-block;
      vertical-align: middle;
    }
    .blockico img {
      vertical-align: middle;
      margin-left: auto;
      margin-right: auto;
      display: inline-block;
    }
    .blocktext {
      display: inline-block;
      width: 220px;
      vertical-align: top;
      margin-left: 12px;
      padding-bottom: 12px;
    }
    .blocktitle {
      margin: 0px !important;
      padding: 0px !important;
      font-family: Roboto;
      font-weight: 500;
      font-size: 16px;
      color: #393c44;
    }
    .blockdesc {
      margin-top: 5px;
      font-family: Roboto;
      color: #808292;
      font-size: 14px;
      line-height: 21px;
    }
    .blockdisabled {
      background-color: #f0f2f9;
      opacity: 0.5;
    }
    #closecard {
      position: absolute;
      margin-top: 32px;
      padding-top: 10px;
      margin-left: calc(380px - 16px - 1px);
      background-color: #fff;
      border-radius: 0px 5px 5px 0px;
      border-bottom: 1px solid lightgray;
      border-right: 1px solid lightgray;
      border-top: 1px solid lightgray;
      width: 56px;
      height: 56px;
      text-align: center;
      z-index: 10;
    }
    #opencard {
      /* position: absolute; */
      z-index: 10;
    }
    #canvas {
      position: absolute;
      height: calc(100% - 100px);
      top: 71px;
      left: 380px;
      z-index: 0;
      overflow: auto;
    }
    
    #modal {
      background-color: rgba(0, 0, 0, 0.5);
      width: 100%;
      z-index: 9999;
      position: absolute;
      top: 0;
      left: 0;
    }
    
    .addmodal {
      margin-top: 15px;
    }
    .addmodal * {
      height: inherit;
      margin-left: -1px;
    }
    .addmodal span {
      margin-right: 3px;
    }
    #pathway {
      background-color: white;
      margin: 10rem;
      width: 100% - 20rem;
      padding: 5rem;
    }
    
    #pathwaytitle {
      background-color: white;
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    #closemodal {
      position: absolute;
      top: 32px;
      right: 32px;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background-color: white;
      cursor: pointer;
    }
    
    #closemodal img {
      width: 24px;
      height: 24px;
      padding: 4px;
    }
    #lefttab {
      height: calc(100% - 76px);
      max-height: calc(100% - 76px);
      padding-left: 16px;
      border-right: 1px solid lightgray;
      box-shadow: 4px 0px 40px rgba(26, 26, 73, 0.05);
    }
    #propwrap {
      position: absolute;
      right: 0;
      top: 76px;
      width: 440px;
      height: calc(100% - 76px);
      z-index: 2;
    }
    #properties {
      /* position: absolute; */
      /* height: 100%; */
      width: 440px;
      padding-left: 24px;
      padding-right: 24px;
      background-color: #fff;
      z-index: 2;
      padding-top: 24px;
      overflow: auto;
      box-shadow: -4px 0px 40px rgba(26, 26, 73, 0);
      transition: all 0.25s cubic-bezier(0.05, 0.03, 0.35, 1);
    }
    .filterlistdesc {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
    }
    .collapsed {
      display: none;
      z-index: -2;
    }
    .expanded {
      display: block;
      right: 0 !important;
      border-left: 1px solid #e8e8ef;
      box-shadow: -4px 0px 40px rgba(26, 26, 73, 0.05);
      z-index: 2;
    }
    #header2 {
      font-size: 20px;
      font-family: Roboto;
      font-weight: bold;
      color: #393c44;
    }
    .header2 {
      font-size: 20px;
      font-family: Roboto;
      font-weight: bold;
      color: #393c44;
    }
    #close {
      position: absolute;
      right: 20px;
      z-index: 9999;
      transition: all 0.25s cubic-bezier(0.05, 0.03, 0.35, 1);
    }
    #close:hover {
      cursor: pointer;
      opacity: 0.7;
    }
    #propswitch {
      border-bottom: 1px solid #e8e8ef;
      width: 331px;
      margin-top: 10px;
      margin-left: -20px;
      margin-bottom: 30px;
    }
    #dataprop {
      font-family: Roboto;
      font-weight: 500;
      font-size: 14px;
      text-align: center;
      color: #393c44;
      width: calc(88% / 3);
      height: 48px;
      line-height: 48px;
      display: inline-block;
      float: left;
      margin-left: 20px;
    }
    #dataprop:after {
      display: block;
      content: '';
      width: 100%;
      height: 4px;
      background-color: #217ce8;
      margin-top: -4px;
    }
    #alertprop {
      display: inline-block;
      font-family: Roboto;
      font-weight: 500;
      color: #808292;
      font-size: 14px;
      height: 48px;
      line-height: 48px;
      width: calc(88% / 3);
      text-align: center;
      float: left;
    }
    #logsprop {
      width: calc(88% / 3);
      display: inline-block;
      font-family: Roboto;
      font-weight: 500;
      color: #808292;
      font-size: 14px;
      height: 48px;
      line-height: 48px;
      text-align: center;
    }
    
    .react-dropdown-select-option-label {
      padding: 3px;
    }
    
    .react-dropdown-select-option-remove {
      padding-right: 6px;
    }
    
    .react-dropdown-select-option {
      border-radius: 5px !important;
    }
    
    .inputlabel {
      font-family: Roboto;
      font-size: 16px;
      font-weight: bold;
      color: #253134;
    }
    
    .inputlabelValue {
      font-family: Roboto;
      font-size: 16px;
      color: #253134;
    }
    .inputcomponent {
      width: 100%;
      border: 1px solid lightgray;
    }
    .custombutton {
      display: flex;
      justify-content: flex-end;
      margin-right: 24px;
      margin-top: 24px;
    }
    .dropme {
      background-color: #fff;
      border-radius: 5px;
      border: 1px solid #e8e8ef;
      box-shadow: 0px 2px 8px rgba(34, 34, 87, 0.05);
      font-family: Roboto;
      font-size: 14px;
      color: #253134;
      height: fit-content;
      /* width: 250px; */
      margin-bottom: 25px;
      padding: 20px;
    }
    .dropme img {
      margin-top: 17px;
      float: right;
      margin-right: 15px;
    }
    .checkus {
      margin-bottom: 10px;
    }
    .checkus img {
      display: inline-block;
      vertical-align: middle;
    }
    .checkus p {
      display: inline-block;
      font-family: Roboto;
      font-size: 14px;
      vertical-align: middle;
      margin-left: 10px;
    }
    #divisionthing {
      height: 1px;
      width: 100%;
      background-color: #e8e8ef;
      position: absolute;
      right: 0px;
      bottom: 80;
    }
    .previewwrapper {
      border: 1px solid lightgray;
      border-bottom: 0px;
      padding: 16px;
      box-shadow: 0px 2px 8px rgb(34 34 87 / 5%);
      margin-bottom: 32px;
      max-height: calc(100vh - 600px);
      overflow: scroll;
    }
    .removeblockwrapper {
      background-color: white;
      width: 440px;
      border-top: 1px solid lightgray;
      position: absolute;
      height: 130px;
      bottom: 18px;
      /* right: -1px; */
      padding: 16px;
    }
    #evidence {
      background-color: white;
      width: 440px;
      border-top: 1px solid lightgray;
      position: absolute;
      height: 270px;
      bottom: 148px;
      padding: 16px;
      overflow-y: auto;
      z-index: 1000;
    }
    #removeblock {
      border-radius: 5px;
      font-family: Roboto;
      font-size: 14px;
      text-align: center;
      /* width: 287px; */
      height: 38px;
      line-height: 38px;
      color: #253134;
      border: 1px solid #e8e8ef;
      transition: all 0.3s cubic-bezier(0.05, 0.03, 0.35, 1);
    }
    #removeblock:hover {
      cursor: pointer;
      opacity: 0.5;
    }
    .noselect {
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Opera and Firefox */
    }
    .blockyname {
      font-family: Roboto;
      font-weight: 500;
      color: #253134;
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
      font-size: 16px;
    }
    .blockyleft img {
      display: inline-block;
      vertical-align: middle;
    }
    .blockyright {
      float: right;
      vertical-align: middle;
      margin-right: 20px;
      width: 43px;
      border-radius: 5px;
      text-align: center;
      background-color: #fff;
      transition: all 0.3s cubic-bezier(0.05, 0.03, 0.35, 1);
      z-index: 10;
    }
    .blockyright:hover {
      background-color: #f1f4fc;
      cursor: pointer;
    }
    .blockyright img {
      margin-top: 0px;
    }
    .blockyleft {
      display: inline-block;
      margin-left: 20px;
      width: 231px;
    }
    .blockyleft:hover {
      cursor: grabbing !important;
    }
    .blockydiv {
      width: 100%;
      height: 1px;
      background-color: #e9e9ef;
    }
    .blockyinfo {
      display: inline-block;
      width: calc(100% - 32px);
      font-family: Roboto;
      font-size: 14px;
      line-height: 20px;
      color: #808292;
      margin: 16px;
      color: #253134;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .blockyinfo:hover {
      cursor: pointer;
    }
    .blockyinfoTextLabel {
      font-weight: normal;
    }
    
    .blockyinfoTextValue {
      font-weight: bold;
      border-bottom: 1px solid #d3dcea;
    }
    
    .block {
      background-color: #fff;
      margin-top: 0px !important;
      box-shadow: 0px 4px 30px rgba(22, 33, 74, 0.05);
    }
    .selectedblock {
      border: 2px solid #217ce8;
      box-shadow: 0px 4px 30px rgba(22, 33, 74, 0.08);
    }
    
    @media only screen and (max-width: 832px) {
      #centerswitch {
        display: none;
      }
    }
    @media only screen and (max-width: 560px) {
      #names {
        display: none;
      }
    }
    
    /* Fix for dropdown bug */
    .css-93ilmd-DropDown {
      width: 360px !important;
    }
    
    .branchinfo {
      position: absolute;
      z-index: 1;
      width: 318px;
      height: 22px;
      margin-bottom: -21px;
      white-space: nowrap;
      overflow: hidden;
      z-index: 9999;
      text-shadow: #ffffff 2px 0 10px;
    }
    .branches {
      display: inline-flex;
      margin-bottom: 5px;
    }
    .branches * {
      margin-right: -1px;
      border-radius: 0px;
    }
    .branchname {
      margin: auto;
      text-align: left;
      width: 75px;
    }
    .branchoperator {
      margin: auto;
      padding: 4px;
      width: 100px;
    }
    .branchvalue {
      margin: auto;
      padding: 4px;
      width: 118px;
    }
    .branches input {
      width: 150px;
      border: 1px solid lightgray;
    }
    .branches > :first-child {
      display: inline-flex;
      align-items: center;
      height: auto;
    }
    .branches > :last-child {
      margin-right: 16px;
    }
    .branches svg {
      height: 15px;
      width: 24px;
    }
    .branches button {
      padding: 3px 5px;
      text-transform: initial;
      border-radius: 0px;
      border: 1px solid lightgray;
    }
    .bundlewithadd {
      margin-right: calc(100% - 76px);
    }
    .bundleadd {
      margin-top: -5px;
    }
    .bundlename {
      width: 100%;
    }
    .createbundle {
      margin-top: 10px;
    }
    .createbundlename {
      margin-bottom: 5px;
      padding: 3px;
      width: calc(100% - 51px);
    }
    .custom-select {
      margin-top: 5px;
    }
  }
`;