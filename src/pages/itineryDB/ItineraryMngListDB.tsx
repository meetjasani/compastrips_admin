import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useHistory } from 'react-router-dom'
import Buttons from "../../component/Buttons/Buttons";
import InputField from "../../component/InputField/InputField";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { ApiDelete, ApiGet, ApiPost, ApiPut } from "../../helper/API/ApiData";
import { dbManagment } from "./ItineraryMngDB";

interface Props {
  data: dbManagment[];
  getDbManagment: (page: any, sizePerPage: any) => void;
  totalSize?: number;
  ltineraryRegBtn?: any;
}

interface PaginationData {
  pagenumber: number;
  sizeperpage: number
}

export const ItineraryMngListDB: React.FC<Props> = ({ data, getDbManagment, totalSize }) => {

  const [selectedFile, setSelectedFile] = useState<File | string>();

  const [uploadResultFail, setUploadResultFail] = useState(false);
  const [uploadResultSuccess, setUploadResultSuccess] = useState(false);
  const [errorSR, setErrorSR] = useState([]);

  const [paginationData, setPaginationData] = useState<PaginationData>({
    pagenumber: 1,
    sizeperpage: 10
  })

  const history = useHistory();

  const ViewProfile = (row: any) => {
    history.push(`/Itinerary-mngDB-reg/${row.id}`);
  }

  const linkFollow = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
    return (
      <Buttons
        type="submit"
        children="보기"
        ButtonStyle="rounded-0 bg-custom-black"
        onClick={() => ViewProfile(row)}
      />
    );
  }

  const columns = [
    {
      dataField: "no_id",
      text: "No",
    },
    {
      dataField: "id",
      text: "고유번호",
    },
    {
      dataField: "country",
      text: "국가",
    },
    {
      dataField: "region",
      text: "지역",
      // DBformatter: priceFormatterDB,
    },
    {
      dataField: "category",
      text: "카테고리",
    },
    {
      dataField: "name",
      text: "이름",
    },

    {
      dataField: "Itinerary_Manage",
      text: "상세",
      formatter: linkFollow,
    },
  ];

  const ltineraryRegBtn = async () => {
    try {
      let formData = new FormData()

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await ApiPost(`general/importCourses`, formData)
        .then((res: any) => {
          let error = JSON.parse(res.message);
          setErrorSR(error?.errorSR ?? []);
        })
      handleTableChange(paginationData.pagenumber, paginationData.sizeperpage)
      setSelectedFile("");
      setUploadResultSuccess(true);
    } catch (error) {
      console.log(error);
      setUploadResultFail(true);
    }
  }

  const handleTableChange = (pagenumber: number, sizeperpage: number) => {
    setPaginationData({
      pagenumber: pagenumber,
      sizeperpage: sizeperpage
    })
    getDbManagment(pagenumber, sizeperpage)
  }

  // useEffects
  useEffect(() => {
    if (selectedFile) {
      ltineraryRegBtn()
    }
  }, [selectedFile])

  const Dbclearing = () => {
    ApiPut("general/cleardb", {})
      .then((res: any) => {
        setUploadResultFail(false)
        setUploadResultSuccess(false)
        getDbManagment(0, 0)
      })
  }
  return (
    <>
      <div className="total-results d-flex">
        <div><h5 className="font-27-bold">총 <span className="span-color-pink"> {totalSize} </span> 개</h5></div>
        <div className="reg-memberbtn ml-auto d-flex align-items-center">
          <div className="excel-import-info"></div>
          <div className="excel-import-info">
            <a href="/location_data_sample.xlsx" download>
              샘플 파일 다운로드
            </a>
          </div>
          <div>
            <label className="csvimprort-lable ml-auto font-16-bold text-white">
              엑셀 파일 IMPORT
              <input
                type="file"
                className="d-none"
                onChange={(e: any) => {
                  if (!e.target.files || e.target.files.length === 0) {
                    window.location.reload();
                    return;
                  }
                  setSelectedFile(e.target.files[0]);
                }}
                onClick={(event: any) => {
                  event.target.value = null
                }}
              />
            </label>
          </div>
          <div>
            <label className="csvimprort-lable ml-auto font-16-bold text-white">
              DB Clearing
              <input
                type="button"
                className="d-none"
                onClick={Dbclearing}
              />
            </label>
          </div>
        </div>
      </div>
      {uploadResultFail && (
        <Alert variant="danger" onClose={() => setUploadResultFail(false)} dismissible>
          <Alert.Heading>파일 업로드 실패</Alert.Heading>
          <p>
            1. 파일에 중복되는 ID 또는 이미 등록된 ID인지 확인이 필요합니다.<br />
            2. 엑셀 파일에 없는 내용이 있는지 확인이 필요합니다.
          </p>
        </Alert>
      )}
      {uploadResultSuccess && (
        <Alert variant="success" onClose={() => setUploadResultSuccess(false)} dismissible>
          {errorSR.length > 0 && <Alert.Heading><span className="error-color truncate">{"포맷에 맞지 않는 데이터를 발견했습니다. : "}{errorSR.join(", ")}</span></Alert.Heading>}
          <Alert.Heading>파일 업로드 성공</Alert.Heading>
          <p>
            정상적으로 엑셀 파일이 등록되었습니다.<br />
          </p>
        </Alert>
      )}
      <div className="App text-center itidb-table">
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
}
