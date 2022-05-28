import React from 'react'
import "./Sidebar.css"
import { CSidebar, CSidebarNav, CCreateElement, CSidebarNavDivider, CSidebarNavDropdown, CSidebarNavItem, CSidebarNavTitle } from '@coreui/react'
import SidebarMenu from "./SidebarMenu"
import { RootStateOrAny, useSelector } from 'react-redux';
import {Image} from 'react-bootstrap'
import AdminPic from "../../img/Filip_profile_circle.png"

function Sidebar() {

    const { is_toggleMenu } = useSelector((state: RootStateOrAny) => state.menuToggle);

    const sidebarClass = is_toggleMenu ? 'sidebar-small' : 'sidebar';


    return (
        <div id="mySidebar" className={sidebarClass}>
            <div className="p-2 d-flex align-items-center ">
                <Image className="admin-profile-img" src={AdminPic}/>
                <h4 className="ml-2 admin-name">Admin</h4>
            </div>
        <CSidebar show={true}>
            <CSidebarNav className="sidebar-in">
            <CCreateElement
            items={SidebarMenu}
            components={{
                CSidebarNavDivider,
                CSidebarNavDropdown,
                CSidebarNavItem,
                CSidebarNavTitle,
            }}
            />
            </CSidebarNav>
        </CSidebar>
        </div>
    )
}

export default Sidebar
