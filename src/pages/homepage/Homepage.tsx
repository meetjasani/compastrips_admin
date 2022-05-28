import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'

function Homepage() {

    // const products = [
    //     {
    //         total_users: 1000,
    //         Hosting_user: 100,
    //         Itineraries_hosted: 50,
    //         total_itineraries: 20,
    //         total_tour: 30
    //     }
    //   ];

    //   const columns = [
    //     {
    //       dataField: "total_users",
    //       text: "All Users",
    //       sort: true
    //     },
    //     {
    //       dataField: "Hosting_user",
    //       text: "Hosting User",
    //       sort: true
    //     },
    //     {
    //       dataField: "Itineraries_hosted",
    //       text: "Itineraries hosted"
    //     },
    //     {
    //       dataField: "total_itineraries",
    //       text: "Total Itineraries"
    //     },
    //     {
    //       dataField: "total_tour",
    //       text: "Total tour DB"  
    //     }
    //   ];
  
  
  
  const data = [{
      id: '1',
      name: 'krunal'
    },
    {
      id: '2',
      name: 'yagnik'
    }
  ]

  const columns = [{
    dataField: 'id',
    text: 'ID'
  },
  {
    dataField: 'name',
    text: 'Name'
  }]


    return (
        <div>
            <h1>This is Home Page</h1>

            <BootstrapTable keyField="id" data={data} columns={columns} />

        </div>
    )
}

export default Homepage
