import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from 'react-router-dom'
import Buttons from "../../component/Buttons/Buttons";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { intineraryProduct } from "./ItineraryMng";

interface Props {
  data: intineraryProduct[],
  getItineraries: (page: any, sizePerPage: any) => void,
  totalSize: number
}

const ItineraryMngList: React.FC<Props> = ({ data, getItineraries, totalSize }) => {

  const history = useHistory();

  const DetailProfile = (row: any) => {
    history.push(`/itinerary-management-reg/${row.id}`);

  }
  const handleTableChange = (pagenumber: number, sizeperpage: number) => {
    getItineraries(pagenumber, sizeperpage)
  }

  const linkFollow = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
    return (
      <Buttons
        type="submit"
        children="관리"
        ButtonStyle="rounded-0 bg-custom-black mt-fixed"
        onClick={() => DetailProfile(row)}
      />
    );
  }

  const language = (row: any) => {
    return <span className="language-mt">{row === "en" ? "영어" : "한국어"}</span>;
  }

  const catetool = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
    console.log("rowIndex", row);

    const entering = (e: any) => {
      e.children[0].style.borderTopColor = '#B931B8';
      e.children[1].style.backgroundColor = '#B931B8';
      e.children[1].style.backgroundColor = '#B931B8';
      e.children[1].style.wordBreak = 'keep-all';
      e.children[1].style.maxWidth = '100%';
    };

    return (
      row.Itinerary_Category.split(',').length > 1 ?
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 200, hide: 100 }}
          overlay={renderTooltip(row.Itinerary_Category)}
          onEntering={entering}
        >
          <p>{row.Itinerary_Category.length >= 8 ? row.Itinerary_Category.slice(0, 8) + "..." : row.Itinerary_Category}</p>
        </OverlayTrigger> : row.Itinerary_Category.length >= 8 ? row.Itinerary_Category.slice(0, 8) + "..." : row.Itinerary_Category
    );
  }



  const columns = [
    {
      dataField: "no_id",
      text: "No",

    },
    {
      dataField: "Itinerary_Country",
      text: "국가",


    },
    {
      dataField: "Itinerary_Region",
      text: "지역",
      // formatter: priceFormatter,

    },
    {
      dataField: "Itinerary_Category",
      text: "카테고리",
      formatter: catetool,
      // events: {

      //   onMouseEnter: (column:any, columnIndex:any, row:any, rowIndex:any) => {
      //     // console.log(column);
      //     // console.log(columnIndex);
      //     // console.log(row);

      //     console.log(rowIndex);
      //   }
      // }
    },
    {
      dataField: "Itinerary_Title",
      text: "제목",

    },
    {
      dataField: "Itinerary_Creator",
      text: "작성자 정보 ",


    },
    {
      dataField: "Itinerary_HostedNumber",
      text: "호스팅된 수",

    },
    {
      dataField: "Itinerary_Status",
      text: "상태",

    },
    {
      dataField: "Itinerary_RegistrationDate",
      text: "등록일 ",
    },
    {
      dataField: "language",
      text: "언어",
      formatter: language,
    },
    {
      dataField: "Itinerary_Manage",
      text: "관리",
      formatter: linkFollow,

    },
  ];

  const ltineraryRegBtn = () => {
    history.push('/itinerary-management-reg');
  }

  const renderTooltip = (TooltipText: any) => (
    <Tooltip id="button-tooltip" {...TooltipText}>
      {TooltipText}
    </Tooltip>
  );

  return (
    <>

      <div className=" total-results  d-flex">
        <div><h5 className="font-27-bold">총 <span className="span-color-pink"> {totalSize ?? 0} </span> 개</h5></div>
        <div className="reg-memberbtn ml-auto">
          <Buttons
            type="submit"
            children="등록하기"
            ButtonStyle="search-button ml-auto"
            onClick={ltineraryRegBtn} />

        </div>

      </div>
      <div className="App text-center itimng-table mt-table-fixed">
        <RemotePagination
          data={data}
          columns={columns}
          totalSize={totalSize}
          onTableChange={(page, sizePerPage) => handleTableChange(page, sizePerPage)}
          pagesizedropdownflag
        />



        {/* <BootstrapTable
          bootstrap4
          keyField="id"
          data={data}
          columns={columns}
          onTableChange={(page,sizePerPage) => {
            console.log("page", page, sizePerPage);
          }}
          pagination={paginationFactory(options)}
        /> */}

      </div>
    </>
  );
}
export default ItineraryMngList
