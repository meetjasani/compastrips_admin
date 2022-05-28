import React from "react";

import { useHistory } from 'react-router-dom'
import Buttons from "../../component/Buttons/Buttons";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { reviewManagment } from "./ReviewMang"

interface Props {
  data: reviewManagment[];
  getReviewManagment: (page: any, sizePerPage: any) => void;
  totalSize?: number;

}
const ReviewMangList: React.FC<Props> = ({ data, getReviewManagment, totalSize }) => {


  const history = useHistory();


  const DetailReview = (row: any) => {
    history.push(`/review-details/${row.id}`);
  }


  const linkFollow = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
    return (
      <Buttons
        type="submit"
        children="관리"
        ButtonStyle="rounded-0 bg-custom-black"
        onClick={() => DetailReview(row)}
      />
    );
  }

  const handleTableChange = (pagenumber: number, sizeperpage: number) => {
    getReviewManagment(pagenumber, sizeperpage)
  }

  const columns = [
    {
      dataField: "no_id",
      text: "No",
    },
    {
      dataField: "user_Name",
      text: "이름",
    },
    {
      dataField: "tour_Title",
      text: "여행 제목",
      // formatter: priceFormatter,
    },
    {
      dataField: "host_Name",
      text: "호스트",
    },
    {
      dataField: "star",
      text: "별점",
    },
    {
      dataField: "content",
      text: "리뷰",
    },
    {
      dataField: "user_RegistrationDate",
      text: "등록일시",
    },
    {
      dataField: "ReviewManage",
      text: "관리",
      formatter: linkFollow,
    },
  ];

  return (
    <>
      <div className="total-results d-flex">
        <div><h5 className="font-27-bold">총 <span className="span-color-pink"> {totalSize} </span> 개
        </h5>
        </div>

      </div>
      <div className="App text-center reviewmng-table">

        <RemotePagination
          data={data}
          columns={columns}
          totalSize={totalSize ?? 0}
          onTableChange={(page, sizePerPage) => handleTableChange(page, sizePerPage)}
          pagesizedropdownflag
        />

        {/* <BootstrapTable
          bootstrap4
          keyField="id"
          data={data}
          columns={columns}
          pagination={paginationFactory(options)}
        /> */}
      </div>
    </>
  );
}
export default ReviewMangList
