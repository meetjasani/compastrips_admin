import { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import { appliedHosting } from '../../pages/appliedhost/AppliedHost';
import { FaqData } from '../../pages/customerservice/faq/Faq';
import { notice } from '../../pages/customerservice/notice/Notice';
import { hostedItinerary } from '../../pages/hosteditinery/HostedItinery';
import { intineraryProduct } from '../../pages/Itinerary/ItineraryMng';
import { dbManagment } from '../../pages/itineryDB/ItineraryMngDB';
import { reviewManagment } from '../../pages/reviewmang/ReviewMang';
import { commonHistory, HostWish, ItineryWish } from '../../pages/User Managment/UserMagReg';
import { userManagment } from '../../pages/User Managment/UserManagement';
// ...
interface Props {
  data: commonHistory[] | ItineryWish[] | HostWish[] | intineraryProduct[] | userManagment[] | dbManagment[] | FaqData[] | hostedItinerary[] | appliedHosting[] | reviewManagment[] | notice[];
  columns: any
  onTableChange: (page?: any, sizePerPage?: any) => void;
  totalSize: number;
  pagesizedropdownflag: boolean
}



const RemotePagination: React.FC<Props> = ({ data, columns, onTableChange, totalSize, pagesizedropdownflag }) => {
  // console.log("paginationData: ", data);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const onPageChange = (pageNumber: any) => {
    setPage(pageNumber);
    onTableChange(pageNumber, sizePerPage);
  }
  const onSizePerPageChange = (sizeperpage: any) => {
    setSizePerPage(sizeperpage)
    setPage(1);
    onTableChange(1, sizeperpage);
  }

  return (
    <div>
      <PaginationProvider
        pagination={
          paginationFactory({
            custom: true,
            // firstPageText:<img src="./img/firstarrow.svg"/>,
            // lastPageText:<img src="./img/lastarrow.svg"/>,
            // prePageText: <img src="./img/nextarrow.svg"/>,
            // nextPageText: <img src="./img/prevarrow.svg"/>,
            
            page,
            sizePerPage,
            totalSize,
            sizePerPageList: [{
              text: '10개', value: 10
            }, {
              text: '20개', value: 20
            }, {
              text: '50개', value: 50
            }, {
              text: '100개', value: 100
            }
            // , {
            //   text: 'All', value: totalSize
            // }
          ],
            alwaysShowAllBtns: true,
          })
        }
      >
        {
          ({
            paginationProps,
            paginationTableProps
          }) => (
            <div>
              <BootstrapTable
                {...paginationTableProps}
               
                remote
                keyField="id"
                data={data}
                columns={columns}
                onTableChange={() => onTableChange(page, sizePerPage)}
              />
              <div className="paginationcustom">
                <PaginationListStandalone
                  {...paginationProps}
                  onPageChange={(p) => onPageChange(p)}
                />
                {totalSize > 0 && pagesizedropdownflag &&
                  <SizePerPageDropdownStandalone
                    {...paginationProps}
                    onSizePerPageChange={(e) => onSizePerPageChange(e)}
                  />
                }

              </div>
            </div>
          )
        }
      </PaginationProvider>
    </div>
  )
};

export default RemotePagination;