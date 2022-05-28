import React, { useEffect, useState } from "react";
import { Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import Buttons from "../../component/Buttons/Buttons";
import InputField from "../../component/InputField/InputField";
import { ApiGet, ApiGetNoAuth, ApiPatch, ApiPost, ApiPut } from "../../helper/API/ApiData";
import moment from "moment";
import RemotePagination from "../../component/RemotePagination/RemotePagination";
import UploadPic from '../../img/uploadpic.png'
import Select from "react-select";
import Swal from "sweetalert2";
import { EngToKor } from "../../helper/util";
registerLocale("ko", ko);
export interface commonHistory {
    id: string;
    HostHisContry: string;
    HostHisTour: string;
    HostHisStatus: string;
    HostHisPax: string;
}
export interface ItineryWish {
    id: string;
    HostHisContry: string;
    HostHisTour: string;
}
export interface HostWish {
    id: string;
    HostWishNick: string;
    HostWishType: string;
    HostWishNational: string;
    HostWishGender: string;
    HostWishAge: string;
}

interface selectOption {
    value: string;
    label: string;
}

const UserMagReg = () => {
    const history = useHistory();
    const [userhost, setuserhost] = useState(false);
    const [userhostApp, setuserhostApp] = useState(false);
    const [userhostwish, setuserhostwish] = useState(false);
    const [hostHistoryData, sethostHistoryData] = useState<commonHistory[]>([]);
    const [totalHostHistory, setTotalHostHistory] = useState(Number);
    const [userAppliedHostingData, setuserAppliedHostingData] = useState<
        commonHistory[]
    >([]);
    const [totalUserAppliedHostingData, setTotalUserAppliedHosting] = useState();
    const [ItineryWish, setItineraryWishData] = useState<ItineryWish[]>([]);
    const [totalItineryWish, setTotalItineraryWish] = useState();
    const [HostWish, setHostWishData] = useState<HostWish[]>([]);
    const [totalhostWish, setTotalHostWishData] = useState();
    const [selectedFile, setSelectedFile] = useState<File>();
    const [birthDate, setBirthDate] = useState<Date | null>()
    const [country, setCountry] = useState<any[]>([])

    const [imgSrc, setImgSrc] = useState(UploadPic);

    const [userdata, setuserData] = useState<any>({
        id: "",
        avatar: "",
        first_name: "",
        last_name: "",
        user_name: "",
        email: "",
        password: "",
        nationality: "",
        gender: "MALE",
        dob: "",
        mobile: "",
        countryCode: "",
        hosting: "",
        signdate: "",
        note: "",
    });

    const genderSelect = [
        { value: "MALE", label: "남" },
        { value: "FEMALE", label: "여" },
    ]

    const [countryCode, setCountryCode] = useState<selectOption[]>([]);

    var { id }: any = useParams();

    // effects


    useEffect(() => {
        getCountryData();
    }, [])

    useEffect(() => {
        id && getUserManagementById();
    }, [countryCode]);

    useEffect(() => {
        if (!selectedFile) return;

        const objectUrl = URL.createObjectURL(selectedFile);

        setImgSrc(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    useEffect(() => {
        console.log("userdata", userdata);

    }, [userdata])

    // helper functions 
    const getCountryData = () => {
        ApiGetNoAuth("general/country").then((res: any) => {
            // console.log("userdata", res.data[0]);

            setuserData({
                ...userdata,
                nationality: res.data[0].name,
                countryCode: {
                    value: `${res.data[0].code.toString()}`,
                    label: `(${res.data[0].code.toString()}) ${res.data[0].name}`
                }
            })
            setCountry(res.data.map((x: any) => {
                return {
                    value: x.name,
                    label: x.name
                }
            }))
            setCountryCode(
                res.data.map((x: any) => {
                    return {
                        value: `${x.code.toString()}`,
                        label: `(${x.code.toString()}) ${x.name}`
                    };
                })
            )
        })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        // console.log("country", country);
    }, [country])

    const gethostHistoryDataById = (pagenumber = 1, sizeperpage = 10) => {
        setuserhost(true);
        id &&
            ApiGet(
                `admin/userHostingHistory/${id}?per_page=${sizeperpage}&page_number=${pagenumber}`
            ).then((res: any) => {
                // console.log("Hosting history: ", res.data);

                setTotalHostHistory(res.data.count);
                sethostHistoryData(
                    res.data.hosting.map((x: any, index: any) => {
                        return {
                            id: x.id,
                            no_id: (res.data.count - ((pagenumber - 1) * sizeperpage)) - index,
                            HostHisContry: x.country,
                            HostHisTour: x.title,
                            HostHisStatus: EngToKor(x.status),
                            HostHisPax: `전체${x.pax},참석${x.participate_count}`,
                            HostHisDate: `${x.date}|${x.start_time}|${x.end_time}`,
                        };
                    })
                );
            });
    };
    const handleTableChangeHostHistory = (
        pagenumber: number,
        sizeperpage: number
    ) => {
        gethostHistoryDataById(pagenumber, sizeperpage);
    };
    const getuserAppliedHosting = (pagenumber = 1, sizeperpage = 10) => {
        setuserhostApp(true);
        id &&
            ApiGet(
                `admin/userAppliedHosting/${id}?per_page=${sizeperpage}&page_number=${pagenumber}`
            ).then((res: any) => {
                // console.log("applied hostings: ", res.data);
                setTotalUserAppliedHosting(res.data.count);
                setuserAppliedHostingData(
                    res.data.participant.map((x: any, index: any) => {
                        return {
                            id: x.id,
                            no_id: (res.data.count - ((pagenumber - 1) * sizeperpage)) - index,
                            HostHisContry: x.country,
                            HostHisTour: x.title,
                            HostHisStatus: EngToKor(x.status),
                            HostHisPax: `전체${x.pax},참석${x.participate_count}`,
                            HostHisDate: `${x.date}|${x.start_time}|${x.end_time}`,
                        };
                    })
                );
            });
    };
    const handleTableChangeuserAppliedHosting = (
        pagenumber: number,
        sizeperpage: number
    ) => {
        getuserAppliedHosting(pagenumber, sizeperpage);
    };

    //HostWish && ItineryWish

    const handleTableChangeHostWish = (
        pagenumber: number,
        sizeperpage: number
    ) => {
        getuserhostwishById(pagenumber, sizeperpage, "hostwish");
    };
    const handleTableChangeItineryWish = (
        pagenumber: number,
        sizeperpage: number
    ) => {
        getuserhostwishById(pagenumber, sizeperpage, "itineryWish");
    };
    const getuserhostwishById = (
        pagenumber = 1,
        sizeperpage = 10,
        type = "both"
    ) => {
        setuserhostwish(true);
        if (id) {
            if (type === "both" || type === "itineryWish") {
                ApiGet(
                    `admin/getItineraryWishlist/${id}?per_page=${sizeperpage}&page_number=${pagenumber}`
                ).then((res: any) => {
                    setTotalItineraryWish(res && res.data && res.data.count);
                    setItineraryWishData(
                        res.data.itinerary.map((x: any, index: any) => {
                            return {
                                id: x.id,
                                no_id: (res.data.count - ((pagenumber - 1) * sizeperpage)) - index,
                                HostWishContry: x.country,
                                HostWishTour: x.title,
                            };
                        })
                    );
                });
            }
            if (type === "both" || type === "hostwish") {
                ApiGet(
                    `admin/getHostWishlist/${id}?per_page=${sizeperpage}&page_number=${pagenumber}`
                ).then((res: any) => {
                    setTotalHostWishData(res && res.data && res.data.count);
                    setHostWishData(
                        res.data.host.map((x: any, index: any) => {
                            return {
                                id: x.id,
                                no_id: (res.data.count - ((pagenumber - 1) * sizeperpage)) - index,
                                HostWishNick: x.nickname,
                                HostWishType: EngToKor(x.host_type),
                                HostWishNational: x.nationality,
                                HostWishGender: EngToKor(x.gender),
                                HostWishAge: x.age_group + "대",
                            };
                        })
                    );
                });
            }
        }
    };
    const getUserManagementById = () => {
        ApiGet(`user/${id}`)
            .then((res: any) => {
                const label = countryCode?.filter(x => x.value === res.data.mobile.split(" ")[0])[0]?.label
                const value = res.data.mobile.split(" ")[0]

                let data = {
                    id: res.data.id,
                    avatar: res.data.avatar,
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    user_name: res.data.user_name,
                    email: res.data.email,
                    password: "",
                    nationality: res.data.nationality,
                    gender: res.data.gender,
                    dob: res.data.dob,
                    mobile: res.data.mobile.split(" ")[1],
                    countryCode: { value, label },
                    hosting: res.data.my_hosting,
                    signdate: moment(res.data.signUp).format("YYYY-MM-DD"),
                    note: res.data.note,
                    coming_up: res.data.count.coming_up,
                    completed: res.data.count.completed,
                    standing_by: res.data.count.standing_by,
                    accepted: res.data.count.accepted,
                    declined: res.data.count.declined,
                    tour: res.data.count.tour,
                    host: res.data.count.host,
                    is_deleted: res.data.is_deleted
                };
                setImgSrc(data.avatar || UploadPic)
                setuserData(data)
            })
            .catch();
    };

    // useEffect(() => {
    //     console.log("userdata: ", userdata);

    // }, [userdata])

    const handleChange = (e: any, key: string) => {
        // console.log("eee", key, e.target.value);

        setuserData((prev: any) => {
            if (key === "countryCode") {
                return {
                    ...prev,
                    [key]: e
                }
            }
            return {
                ...prev,
                [key]: e.target.value,
            };
        });
    };

    const BacktoUserMag = () => {
        history.push("/user-management");
    };

    const SaveUser = () => {
        let formData = new FormData();

        formData.append("first_name", userdata.first_name);
        formData.append("last_name", userdata.last_name);
        formData.append("user_name", userdata.user_name);
        formData.append("mobile", userdata.countryCode.value + " " + userdata.mobile);
        if (selectedFile) {
            formData.append('avatar', selectedFile);
        }
        // console.log("userdata.countryCode", userdata.countryCode.value);

        // ApiPut(`admin/note?user=${id}`, { note: userdata.note })


        ApiPatch(`admin/editUser?id=${id}`, formData).then((res: any) => {
            Swal.fire({
                title: '저장 완료',
                text: "저장이 완료되었습니다!",
                showClass: {
                    popup: 'animated fadeInDown faster',
                    icon: 'animated heartBeat delay-1s'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster',
                },
                confirmButtonText: `확인`,
                showConfirmButton: true,
                showCloseButton: true
            })
                // swal("저장 완료", "저장이 완료되었습니다!", {})
                .then((data) => {
                    if (data) {
                        window.location.href = '/user-management'
                    }
                });
        });


        if (userdata.note !== undefined) {
            ApiPut(`admin/note?user=${id}`, { note: userdata.note })
                .then((res: any) => {
                    Swal.fire({
                        title: '저장 완료',
                        text: "저장이 완료되었습니다!",
                        showClass: {
                            popup: 'animated fadeInDown faster',
                            icon: 'animated heartBeat delay-1s'
                        },
                        hideClass: {
                            popup: 'animated fadeOutUp faster',
                        },
                        confirmButtonText: `확인`,
                        showConfirmButton: true,
                        showCloseButton: true
                    })
                        // swal("저장 완료", "저장이 완료되었습니다!", {
                        // })
                        .then((data) => {
                            if (data) {
                                window.location.href = '/user-management'
                            }
                        });
                })
        } else {
            return;
        }
    };

    const createUser = () => {
        let formData = new FormData();

        formData.append("first_name", userdata.first_name);
        formData.append("last_name", userdata.last_name);
        formData.append("user_name", userdata.user_name);
        formData.append("email", userdata.email);
        formData.append("password", userdata.password);
        formData.append("gender", userdata.gender);
        formData.append("nationality", userdata.nationality);
        formData.append("mobile", userdata.countryCode.value + " " + userdata.mobile);
        formData.append("dob", userdata.dob);
        // console.log("formData", formData);

        if (selectedFile) {
            formData.append('avatar', selectedFile);
        }
        // console.log("userdata.countryCode", userdata.countryCode.value);

        // ApiPut(`admin/note?user=${id}`, { note: userdata.note })


        ApiPost(`admin/addUser`, formData).then((res: any) => {
            Swal.fire({
                title: '저장 완료',
                text: "저장이 완료되었습니다!",
                showClass: {
                    popup: 'animated fadeInDown faster',
                    icon: 'animated heartBeat delay-1s'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster',
                },
                confirmButtonText: `확인`,
                showConfirmButton: true,
                showCloseButton: true
            })
                // swal("저장 완료", "저장이 완료되었습니다!", {})
                .then((data) => {
                    if (data) {
                        window.location.href = '/user-management'
                    }
                });
        });
    };

    const DeleteuserMng = () => {
        Swal.fire({
            title: '회원정보 삭제',
            text: "회원정보를 삭제하시겠습니까? 삭제 시 복구가 불가합니다.",
            showClass: {
                popup: 'animated fadeInDown faster',
                icon: 'animated heartBeat delay-1s'
            },
            hideClass: {
                popup: 'animated fadeOutUp faster',
            },
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            reverseButtons: true,
            showCloseButton: true,
        }).then((result: { isConfirmed: any }) => {
            if (result.isConfirmed) {
                ApiPut(`admin/auth/deleteUser/${id}`, null).then((res: any) => {
                    Swal.fire({
                        title: '여행 일정 삭제',
                        text: "일정이 삭제되었습니다!",
                        showClass: {
                            popup: 'animated fadeInDown faster',
                            icon: 'animated heartBeat delay-1s'
                        },
                        hideClass: {
                            popup: 'animated fadeOutUp faster',
                        },
                        confirmButtonText: `확인`,
                        showConfirmButton: true,
                        showCloseButton: true
                    })
                        .then((data) => {
                            if (data) {
                                window.location.href = '/user-management'
                            }
                        });
                });
            }
        })
    };

    const HostHisdate = (
        cell: any,
        row: any,
        rowIndex: any,
        formatExtraData: any
    ) => {
        const all_date = cell.split('|')
        const date = new Date(all_date[0])

        return (
            <div className="flex table-review-img">
                <p className="font-16-bold mb-0 color-40">
                    {all_date[0].replaceAll('-', '.')} ( {date.toLocaleString('ko-KR', { weekday: 'long' })} ) </p>
                <p className="font-16-bold mb-0 color-40">{all_date[1].slice(0, 5)} - {all_date[2].slice(0, 5)}</p>
            </div>
        );
    };

    const setDateInReg = (date: Date | null) => {
        setuserData({
            ...userdata,
            dob: `${moment(date).format().slice(0, 10)}`
        })
        setBirthDate(date)
    }

    const host_his_head = [
        {
            dataField: "no_id",
            text: "No",
        },
        {
            dataField: "HostHisContry",
            text: "국가",
        },
        {
            dataField: "HostHisTour",
            text: "여행제목",
        },
        {
            dataField: "HostHisStatus",
            text: "진행 상태",
        },
        {
            dataField: "HostHisPax",
            text: "여행 인원",
        },
        {
            dataField: "HostHisDate",
            text: "여행일정",
            formatter: HostHisdate,
        },
    ];

    const ItineryWishHead = [
        {
            dataField: "no_id",
            text: "No",
        },
        {
            dataField: "HostWishContry",
            text: "국가",
        },
        {
            dataField: "HostWishTour",
            text: "여행제목",
        },
    ];

    const HostWishHead = [
        {
            dataField: "no_id",
            text: "No",
        },
        {
            dataField: "HostWishNick",
            text: "호스트 이름",
        },
        {
            dataField: "HostWishType",
            text: "호스트 타입",
        },
        {
            dataField: "HostWishNational",
            text: "국적",
        },
        {
            dataField: "HostWishGender",
            text: "성별",
        },
        {
            dataField: "HostWishAge",
            text: "연령대",
        },
    ];

    return (
        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">회원 관리</h2>
                </div>
            </div>
            <div className="creator-table set-select set-line-height">
                <div className=" center-box">
                    <div>
                        <div className="">
                            <div className="text-left align-items-center">
                                <h4 className=" font-25-bold mb-25">기본 회원정보</h4>
                            </div>
                            <Form className="user_mngform">
                                <div className="border-tabel-b1">
                                    <div>
                                        <div className="d-flex">
                                            <div className=" yellow-bg-table font-18-bold">
                                                프로필 이미지
                                            </div>
                                            <div
                                                className="profile-table-td-input p-0 profile-img-user img align-items-center"
                                            >
                                                <div className="position-relative">
                                                    <img
                                                        src={imgSrc}
                                                        alt="Profile"
                                                        id="usermng-profile"
                                                    />

                                                    <InputField
                                                        label=""
                                                        fromrowStyleclass=""
                                                        name=""
                                                        value=""
                                                        placeholder=""
                                                        type="file"
                                                        InputstyleClass="custom-file-input"
                                                        lablestyleClass=""
                                                        onChange={(e: any) => {
                                                            if (!e.target.files || e.target.files.length === 0) {
                                                                setSelectedFile(undefined);
                                                                return;
                                                            }
                                                            setSelectedFile(e.target.files[0]);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex ">
                                            <div className=" yellow-bg-table font-18-bold">
                                                이름
                                            </div>
                                            <div
                                                className="profile-table-td-input align-items-center"
                                            >
                                                <div className="reg-p-input d-md-flex">
                                                    <InputField
                                                        name="firstname"
                                                        value={userdata.first_name}
                                                        lablestyleClass=""
                                                        InputstyleClass="mb-0 usermng-name custom-place"
                                                        onChange={(e) => {
                                                            handleChange(e, "first_name");
                                                        }}
                                                        label=""
                                                        placeholder="이름을 입력해주세요"
                                                        type="text"
                                                        fromrowStyleclass=""
                                                    />
                                                    <InputField
                                                        name="lastname"
                                                        value={userdata.last_name}
                                                        lablestyleClass=""
                                                        InputstyleClass="mb-0 usermng-name custom-place"
                                                        onChange={(e) => handleChange(e, "last_name")}
                                                        label=""
                                                        placeholder="성을 입력해주세요"
                                                        type="text"
                                                        fromrowStyleclass=""
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex">
                                            <div className=" yellow-bg-table font-18-bold">
                                                닉네임
                                            </div>
                                            <div
                                                className="profile-table-td-input align-items-center"
                                            >
                                                <div className="reg-p-input">
                                                    <InputField
                                                        name="username"
                                                        value={userdata.user_name}
                                                        lablestyleClass=""
                                                        InputstyleClass="mb-0 userinputs custom-place"
                                                        onChange={(e) => handleChange(e, "user_name")}
                                                        label=""
                                                        placeholder="사용자명(10자이내)을 입력해 주세요"
                                                        type="text"
                                                        fromrowStyleclass=""
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex">
                                            <div className=" yellow-bg-table font-18-bold">
                                                이메일 주소
                                            </div>
                                            <div
                                                className="profile-table-td-input align-items-center"
                                            >
                                                <div className="reg-p-input">
                                                    {id ? <InputGroup className="bg-color">
                                                        <InputGroup.Text className="userinputs disble">
                                                            {userdata.email}
                                                        </InputGroup.Text>
                                                    </InputGroup>
                                                        :
                                                        <InputField
                                                            name="email"
                                                            value={userdata.email}
                                                            lablestyleClass=""
                                                            InputstyleClass="mb-0 userinputs custom-place"
                                                            onChange={(e) => handleChange(e, "email")}
                                                            label=""
                                                            placeholder="이메일 주소를 입력해 주세요"
                                                            type="text"
                                                            fromrowStyleclass=""
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex">
                                            <div className=" yellow-bg-table font-18-bold">
                                                Password
                                            </div>
                                            <div
                                                className="profile-table-td-input align-items-center"
                                            >
                                                <div className="reg-p-input">
                                                    {id ?
                                                        <InputGroup className="bg-color">
                                                            <InputGroup.Text className="userinputs disble">
                                                                ********
                                                            </InputGroup.Text>
                                                        </InputGroup>
                                                        :
                                                        <InputField
                                                            name="password  "
                                                            value={userdata.password}
                                                            lablestyleClass=""
                                                            InputstyleClass="mb-0 userinputs custom-place"
                                                            onChange={(e) => handleChange(e, "password")}
                                                            label=""
                                                            placeholder="영문, 숫자 혼합 8~16자로 입력해 주세요"
                                                            type="text"
                                                            fromrowStyleclass=""
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex">
                                            <div className=" yellow-bg-table font-18-bold">
                                                국적
                                            </div>
                                            <div
                                                className="profile-table-td-input align-items-center"
                                            >
                                                <div className="reg-p-input blank-malefemale">
                                                    {id ?
                                                        <InputGroup className="bg-color">
                                                            <InputGroup.Text className="userinputs custom-place disble">
                                                                {userdata.nationality}
                                                            </InputGroup.Text>
                                                        </InputGroup>
                                                        :

                                                        <Select
                                                            value={{ value: userdata.nationality, label: userdata.nationality }}
                                                            options={country}
                                                            name="userMng_National"
                                                            // value={state.userMng_National}
                                                            onChange={(e: any) => {
                                                                console.log("e", e);

                                                                setuserData({
                                                                    ...userdata,
                                                                    nationality: e.value,
                                                                })
                                                            }
                                                            }
                                                        />

                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex">
                                            <div className=" yellow-bg-table font-18-bold">
                                                성별
                                            </div>
                                            <div
                                                className="profile-table-td-input align-items-center"
                                            >
                                                <div className="reg-p-input blank-malefemale">
                                                    {id ?
                                                        <InputGroup className="bg-color">
                                                            <InputGroup.Text className="userinputs  custom-place disble">
                                                                {userdata.gender === "MALE" ? '남' : '여'}
                                                            </InputGroup.Text>
                                                        </InputGroup>
                                                        :
                                                        <Select
                                                            defaultValue={genderSelect[0]}
                                                            options={genderSelect}
                                                            name="userMng_National"
                                                            placeholder="성별을 선택해주세요"
                                                            // value={state.userMng_National}
                                                            onChange={(e: any) => {
                                                                setuserData({
                                                                    ...userdata,
                                                                    gender: e.value,
                                                                })
                                                            }
                                                            }
                                                        />}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex">
                                            <div className=" yellow-bg-table font-18-bold">
                                                생년월일
                                            </div>
                                            <div
                                                className="profile-table-td-input align-items-center"
                                            >
                                                <div className="reg-p-input d-md-flex">
                                                    <InputGroup className="">
                                                        {id ?
                                                            <>
                                                                <InputGroup.Text className="userbdayinputs disble custom-place">
                                                                    {userdata.dob.slice(0, 4)}
                                                                </InputGroup.Text>
                                                                <InputGroup.Text className="userbdayinputs disble custom-place">
                                                                    {userdata.dob.slice(5, 7)}
                                                                </InputGroup.Text>
                                                                <InputGroup.Text className="userbdayinputs disble custom-place">
                                                                    {userdata.dob.slice(8, 10)}
                                                                </InputGroup.Text>
                                                            </>
                                                            :
                                                            <div className="blank-datepicker">
                                                                <DatePicker
                                                                    name=""
                                                                    selected={birthDate}
                                                                    onChange={(date: Date | null) => setDateInReg(date)}
                                                                    dateFormat="dd.MM.yyyy"
                                                                    selectsStart
                                                                    locale="ko"
                                                                    placeholderText="YYYY-MM-DD"
                                                                />
                                                            </div>
                                                        }
                                                    </InputGroup>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex">
                                            <div className=" yellow-bg-table font-18-bold">
                                                휴대폰 번호
                                            </div>
                                            <div
                                                className="profile-table-td-input "
                                            >
                                                <div className="reg-p-input d-flex">
                                                    <div className="select-option-2 custom-countrycode">
                                                        <Select
                                                            value={{ value: userdata.countryCode.value, label: userdata.countryCode.label }}
                                                            options={countryCode}
                                                            name="countryCode"
                                                            // placeholder="(+82) 대한민국"
                                                            onChange={(e) => handleChange(e, "countryCode")
                                                            }
                                                        />
                                                    </div>
                                                    <InputField
                                                        name="date"
                                                        value={userdata.mobile}
                                                        lablestyleClass=""
                                                        InputstyleClass="mb-0 usermng-name custom-place "
                                                        onChange={(e) => handleChange(e, "mobile")}
                                                        label=""
                                                        placeholder="휴대폰 번호"
                                                        type="text"
                                                        fromrowStyleclass="ml-5px"
                                                    />
                                                    {/* </div> */}
                                                </div>
                                            </div>
                                        </div>

                                        {id &&
                                            <div className="d-flex">
                                                <div className=" yellow-bg-table font-18-bold">
                                                    가입일
                                                </div>
                                                <div
                                                    className="profile-table-td-input align-items-center"
                                                >
                                                    <p className="mb-0 nondisbale">{userdata.signdate}</p>
                                                </div>
                                            </div>}
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>

                    {id &&
                        <div className="mt-62">
                            <Form>
                                <div className="overflow-table set-positon-absolute">
                                    <div className="">
                                        <h4 className=" font-25-bold mb-25">활동 내역</h4>
                                    </div>

                                    <div className="border-tabel-b1">
                                        <div>
                                            <div className="d-flex">
                                                <div className="yellow-bg-table font-18-bold">
                                                    호스팅한 여행
                                                </div>
                                                <div className="profile-table-td-input d-lg-flex">
                                                    <p className="mb-0">
                                                        진행중 <span className="span-color-pink"> {userdata.coming_up} </span> |
                                                        종료 <span className="span-color-pink"> {userdata.completed} </span>
                                                    </p>
                                                    <Buttons
                                                        type="button"
                                                        // children="목록으로"
                                                        children="내역보기"
                                                        ButtonStyle="modal-btn-user font-16-bold text-white"
                                                        onClick={() => gethostHistoryDataById()}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex">
                                                <div className="yellow-bg-table font-18-bold">
                                                    여행 참석 신청
                                                </div>
                                                <div className="profile-table-td-input d-lg-flex">
                                                    <p className="mb-0 ">
                                                        승인 전 <span className="span-color-pink"> {userdata.standing_by} </span> |
                                                        승인완료 <span className="span-color-pink"> {userdata.accepted} </span>
                                                        ㅣ승인불가 <span className="span-color-pink"> {userdata.declined} </span>
                                                    </p>
                                                    <Buttons
                                                        type="button"
                                                        // children="목록으로"
                                                        children="내역보기"
                                                        ButtonStyle="modal-btn-user font-16-bold text-white"
                                                        onClick={() => getuserAppliedHosting()}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex">
                                                <div className="yellow-bg-table font-18-bold">
                                                    찜
                                                </div>
                                                <div className="profile-table-td-input d-lg-flex">
                                                    <p className="mb-0 ">
                                                        여행일정 <span className="span-color-pink"> {userdata.tour} </span> |
                                                        호스트 <span className="span-color-pink"> {userdata.host} </span>
                                                    </p>
                                                    <Buttons
                                                        type="button"
                                                        // children="목록으로"
                                                        children="내역보기"
                                                        ButtonStyle="modal-btn-user font-16-bold text-white"
                                                        // onClick={() => { return setuserhostwish(true); }}
                                                        onClick={() => getuserhostwishById()}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Col className="textarea-border"></Col>
                                </div>
                            </Form>
                        </div>
                    }

                    {id &&
                        <div >
                            <div className="d-flex border-tabel-b1">

                                <div className="yellow-bg-table font-18-bold">
                                    관리자 메모
                                </div>
                                <div className="profile-table-td-input">
                                    <div className="reg-p-input">
                                        <InputField
                                            name="text"
                                            value={userdata.note}
                                            lablestyleClass=""
                                            InputstyleClass="mb-0 manage-datepicker"
                                            onChange={(e) => handleChange(e, "note")}
                                            // onChange={handleChange}
                                            label=""
                                            placeholder=""
                                            type="textarea"
                                            fromrowStyleclass=""
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    }

                    <div className="px-110 w-100">
                        <div className="text-center">
                            <Buttons
                                type="submit"
                                children="목록"
                                ButtonStyle="border-button font-22-bold"
                                onClick={BacktoUserMag}
                            />

                            <Buttons
                                type="submit"
                                children="저장"
                                ButtonStyle="modal-pink-button font-22-bold"
                                onClick={() => {
                                    id ? SaveUser() : createUser();
                                }}
                            />
                            {!userdata.is_deleted && id &&
                                <Buttons
                                    type="submit"
                                    children="삭제"
                                    ButtonStyle="border-button font-22-bold"
                                    onClick={DeleteuserMng}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={userhost}
                onHide={() => {
                    setuserhost(false);
                }}
                dialogClassName="modal-80w my_his_modal"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton className="p-0"></Modal.Header>
                <Modal.Body className="p-0">
                    <Col md={12} className="p-0">
                        <div className="center-modal-title">
                            <h6>호스팅한 여행 내역</h6>
                        </div>
                    </Col>
                    <Col className="overflow-table p-0">
                        <div className="App text-center my-host-table">
                            <RemotePagination
                                data={hostHistoryData}
                                columns={host_his_head}
                                totalSize={totalHostHistory ?? 0}
                                onTableChange={(page, sizePerPage) =>
                                    handleTableChangeHostHistory(page, sizePerPage)
                                }
                                pagesizedropdownflag={false}
                            />
                        </div>
                    </Col>
                </Modal.Body>
            </Modal>

            <Modal
                show={userhostApp}
                onHide={() => {
                    setuserhostApp(false);
                }}
                dialogClassName="modal-80w my_his_modal"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body className="p-0">
                    <Col md={12}>
                        <div className="center-modal-title">
                            <h6>여행 참석신청 내역</h6>
                        </div>
                    </Col>
                    <Col className="overflow-table p-0">
                        <div className="App text-center my-applidehost">
                            <RemotePagination
                                data={userAppliedHostingData}
                                columns={host_his_head}
                                totalSize={totalUserAppliedHostingData ?? 0}
                                onTableChange={(page, sizePerPage) =>
                                    handleTableChangeuserAppliedHosting(page, sizePerPage)
                                }
                                pagesizedropdownflag={false}
                            />
                        </div>
                    </Col>
                </Modal.Body>
            </Modal>

            <Modal
                show={userhostwish}
                onHide={() => {
                    setuserhostwish(false);
                }}
                dialogClassName="modal-80w my_his_modal"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body className="p-0">
                    <Col md={12}>
                        <div className="center-modal-title">
                            <h6>찜한 내역</h6>
                        </div>
                    </Col>
                    <Col className="overflow-table p-0">
                        <h3 className="modaltable-title2">여행일정</h3>
                        <div className="App text-center my-wishlist">
                            <RemotePagination
                                data={ItineryWish}
                                columns={ItineryWishHead}
                                totalSize={totalItineryWish ?? 0}
                                onTableChange={(page, sizePerPage) =>
                                    handleTableChangeItineryWish(page, sizePerPage)
                                }
                                pagesizedropdownflag={false}
                            />
                        </div>
                    </Col>

                    <Col className="overflow-table p-0">
                        <h3 className="modaltable-title2">호스트</h3>
                        <div className="App text-center myhost-wishlist">
                            <RemotePagination
                                data={HostWish}
                                columns={HostWishHead}
                                totalSize={totalhostWish ?? 0}
                                onTableChange={(page, sizePerPage) =>
                                    handleTableChangeHostWish(page, sizePerPage)
                                }
                                pagesizedropdownflag={false}
                            />
                        </div>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default UserMagReg;
