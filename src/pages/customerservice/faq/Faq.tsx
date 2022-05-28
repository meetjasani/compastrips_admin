import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import InputField from "../../../component/InputField/InputField";
import Buttons from "../../../component/Buttons/Buttons";
import FaqList from "./Faq-List";
import { ApiGet } from "../../../helper/API/ApiData";

export interface FaqData {
    id: number;
    answer: string;
    question: string;
    updated_at: string;
    created_at: string;
    language: string;
    view_count: number;
}
function Faq() {

    // variabels and states

    const [totalSize, setTotalSize] = useState<number>(0);
    const [FaqData, setFaqData] = useState<FaqData[]>([]);
    const [FaqSearch, setFaqSearch] = useState("");




    // helper functions
    const getFAQ = (page = 1, sizePerPage = 10) => {
        ApiGet(
            `general/faq?keyword=${FaqSearch}&per_page=${sizePerPage}&page_number=${page}&getAll=true`
        ).then((res: any) => {
            setTotalSize(res.data && res.data.count);
            setFaqData(
                res.data &&
                res.data.faq &&
                res.data.faq.map((x: any, index: any) => {
                    return {
                        id: x.id,
                        no_id: (res.data.count - ((page - 1) * sizePerPage)) - index,
                        answer: x.answer,
                        question: x.question,
                        updated_at: `${x.updated_at.slice(0, 10)} ${x.updated_at.slice(
                            11,
                            16
                        )}`,
                        created_at: `${x.created_at.slice(0, 10)} ${x.created_at.slice(
                            11,
                            16
                        )}`,
                        language: x.language,
                        view_count: x.view_count,
                    };
                })
            );
        }).catch();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFaqSearch(e.target.value);
        console.log("e.target.value", e);
    };



    const viewMore = (e?: any) => {
        getFAQ()
    };

    // useEffects
    useEffect(() => {
        getFAQ();
    }, []);

    return (
        <>
            <div className="col-12 p-0">
                <div className="bg-navigation">
                    <h2 className="text-white">자주 묻는 질문</h2>
                </div>
            </div>

            <>
                <div className="custom-left">
                    <div className="topfilter-table">
                        <div className="top-filters condition-select p-0">

                            <div className="filter-t-box">
                                <div className="head-member">
                                    <h6 className="font-18-bold ln-65">검색</h6>
                                </div>
                            </div>
                            <div

                                className="filter-d-box FAQ-hedar"
                            >
                                <Form.Row className="stela-row m-0">
                                    <Form.Row className="m-0">

                                        <div className=" d-flex">
                                            <InputField
                                                name="FAQSearch"
                                                value=""
                                                lablestyleClass=""
                                                InputstyleClass=""
                                                onChange={(e: any) => {
                                                    handleChange(e);
                                                }}
                                                label=""
                                                placeholder="검색어 입력"
                                                type="text"
                                                fromrowStyleclass="width-input"
                                            />

                                            <Buttons
                                                type="submit"
                                                children="검색"
                                                ButtonStyle="search-button ml-2"
                                                onClick={viewMore}
                                            />
                                        </div>

                                    </Form.Row>
                                </Form.Row>
                            </div>

                        </div>

                        <div className="p-0">

                            <div className="table-width">
                                <FaqList
                                    data={FaqData}
                                    getFAQ={getFAQ}
                                    totalSize={totalSize}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </>
        </>
    );
}

export default Faq;
