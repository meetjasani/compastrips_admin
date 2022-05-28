import React from "react";
import { useHistory } from "react-router-dom";
import Buttons from "../../../component/Buttons/Buttons";
import RemotePagination from "../../../component/RemotePagination/RemotePagination";
import { FaqData } from "./Faq";

interface Props {
  data: FaqData[];
  getFAQ: (page: any, sizePerPage: any) => void;
  totalSize?: number;
}

const FaqList: React.FC<Props> = ({ data, getFAQ, totalSize }) => {
  const history = useHistory();

  const createFaq = () => {
    history.push(`/register-Faq`);
  };

  const handleTableChange = (pagenumber: number, sizeperpage: number) => {
    getFAQ(pagenumber, sizeperpage)
  }

  const ModifyFaq = (row: any) => {
    console.log("row", row);
    history.push(`/edit-Faq/${row.id}`);
  };

  const linkFollow = (
    cell: any,
    row: any,
    rowIndex: any,
    formatExtraData: any
  ) => {
    return (
      <Buttons
        type="submit"
        children="관리"
        ButtonStyle="rounded-0 bg-custom-black w-120px h-49"
        onClick={() => ModifyFaq(row)}
      />
    );
  };

  function priceFormatter(
    cell:
      | boolean
      | React.ReactChild
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined,
    row: any
  ) {
    return <strong style={{ color: "#B931B8" }}>{cell}</strong>;
  }

  const language = (row: any) => {
    return <span className="language-mt">{row === "en" ? "영어" : "한국어"}</span>;
  }

  const date = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
    return (
      <>
        <p>{`${row.created_at.slice(0, 10)} ${row.created_at.slice(11, 16)}`}</p>
        <p>{`${row.updated_at.slice(0, 10)} ${row.updated_at.slice(11, 16)}`}</p>
      </>
    );
  };

  const columns = [
    {
      dataField: "no_id",
      text: "No",
    },
    {
      dataField: "question",
      text: "제목",
      formatter: priceFormatter,
    },
    {
      dataField: "view_count",
      text: "조회수",
    },
    {
      dataField: "created_at",
      text: "등록일/최근 수정일",
      formatter: date,
    },
    {
      dataField: "language",
      text: "언어",
      formatter: language,
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
        <div>
          <h5 className="font-27-bold">
            총 <span className="span-color-pink">{totalSize}</span> 개
          </h5>
        </div>

        <Buttons
          type="submit"
          children="등록"
          ButtonStyle="Register-button ml-auto"
          onClick={createFaq}
        />
      </div>

      <div className="App text-center faq-table">

        <RemotePagination
          data={data}
          columns={columns}
          totalSize={totalSize ?? 0}
          onTableChange={(page, sizePerPage) => handleTableChange(page, sizePerPage)}
          pagesizedropdownflag
        />


      </div>
    </>
  );
};
export default FaqList;
