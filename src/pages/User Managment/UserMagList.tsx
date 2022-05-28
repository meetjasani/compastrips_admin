import React from "react";
import { useHistory } from 'react-router-dom'
import Buttons from "../../component/Buttons/Buttons";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import { userManagment } from "./UserManagement";

interface Props {
    data: userManagment[];
    getUserManagment: (page: any, sizePerPage: any) => void;
    totalSize?: number;
    ltineraryRegBtn?: any;
}

const UserMagList: React.FC<Props> = ({ data, getUserManagment, totalSize, ltineraryRegBtn }) => {

    // variables and states
    const history = useHistory();


    // helper functions
    const userManage = (row: any) => {
        history.push(`/user-management-edit/${row.id}`);
    }


    const linkFollow = (cell: any, row: any, rowIndex: any, formatExtraData: any) => {
        return (
            <Buttons
                type="button"
                children="관리"
                ButtonStyle="rounded-0 bg-custom-black"
                onClick={() => userManage(row)}
            />
        );
    }

    const gotoUserReg = () => {
        history.push(`/user-management-reg`);
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
            dataField: "user_Nick",
            text: "닉네임",
        },
        {
            dataField: "user_email",
            text: "이메일 주소",
        },
        {
            dataField: "user_Mo",
            text: "휴대폰 번호",
        },
        {
            dataField: "user_National",
            text: "국적",
        },
        {
            dataField: "user_Hosting",
            text: "호스팅한 여행",
        },
        {
            dataField: "user_SignDate",
            text: "가입일",
        },
        {
            dataField: "Itinerary_Manage",
            text: "관리",
            formatter: linkFollow,
        },
    ];


    const handleTableChange = (pagenumber: number, sizeperpage: number) => {
        getUserManagment(pagenumber, sizeperpage)
    }

    // const options = {
    //     paginationSize: 5,
    //     pageStartIndex: 1,
    //     alwaysShowAllBtns: true,
    //     hidePageListOnlyOnePage: true,
    //     showTotal: true,
    //     paginationTotalRenderer: customTotal,
    //     disablePageTitle: true,
    //     sizePerPageList: [{
    //         text: '10', value: 10
    //     }, {
    //         text: '20', value: 20
    //     }, {
    //         text: 'All', value: data.length
    //     }]
    // };

    return (
        <div className="usermng-table">
            <div className="total-results d-flex">
                <div><h5 className="font-27-bold">총 <span className="span-color-pink"> {totalSize} </span> 개
                </h5>
                </div>


                <div className="reg-memberbtn ml-auto">

                    <Buttons
                        type="submit"
                        children="회원 등록하기"
                        ButtonStyle="Register-button-small ml-auto"
                        onClick={() => { gotoUserReg() }}
                    />

                    <Buttons
                        type="submit"
                        children="전체 회원 엑셀 파일 다운로드"
                        ButtonStyle="csvexport-btn ml-auto"
                        onClick={ltineraryRegBtn} />
                </div>
            </div>
            <div className="App text-center user-mngpage">
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
                    columns={DbMngListHead}
                    pagination={paginationFactory(options)}
                /> */}
            </div>
        </div>
    );
}
export default UserMagList
