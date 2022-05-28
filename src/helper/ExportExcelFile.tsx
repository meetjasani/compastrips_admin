import moment from "moment";
import Auth from "../config/Auth";
import { BaseURL } from "./API/ApiData";

const exportFile = (state:any) =>{
    let start = state.startDate ? moment(state.startDate).format("YYYY-MM-DD") : "";
    let end = state.endDate ? moment(state.endDate).format("YYYY-MM-DD") : "";

    const url = BaseURL + `admin/exportUserData?date_option=${state.signDelDate}&start_date=${start}&end_date=${end}&nationality=${state.userMng_National}&my_hosting=${state.userMng_Host}&user_information=${state.userMng_Info}&search_term=${state.itneryDBSearch}`

    const requestBody:any = {
      method: "GET",
      headers: { 
        Authorization: Auth.getToken(), 
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  
      },
      responseType: "blob"
    };

    fetch(url, requestBody)
      .then((response) => response.blob())
      .then((result) => {
        var data = new Blob([result], { type: 'text/xls' });
        var csvURL = window.URL.createObjectURL(data);
        var tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', `test.xls`);
        tempLink.click();
      });
}

export default exportFile