import React, { useEffect } from 'react'
import { Route, Switch, useHistory, Redirect } from 'react-router'
import Auth from '../config/Auth'
import { ApiGet } from '../helper/API/ApiData'
import Layouts from '../layouts/Layouts'
import LogRegLayout from '../layouts/LogRegLayout'
import AppliedHostingHistory from './appliedhost/Applied-Hosting-History '
import AppliedHost from './appliedhost/AppliedHost'
import Faq from './customerservice/faq/Faq'
import RegisterFaq from './customerservice/faq/RegisterFaq'
import Notice from './customerservice/notice/Notice'
import RegisterNotice from './customerservice/notice/RegisterNotice'
import Dashboard from './dashboard/Dashboard'
import Hosteditinerarydetails from './hosteditinery/Hosteditinerarydetails'
import HostedItinery from './hosteditinery/HostedItinery'
import ItineraryMng from './Itinerary/ItineraryMng'
import ItineraryMngReg from './Itinerary/ltineraryMngReg'
import ItineraryMngDB from './itineryDB/ItineraryMngDB'
import ItineraryMngDBReg from './itineryDB/ItineraryMngDBReg'
import Login from './Login/Login'
import ReviewDetails from './reviewmang/ReviewDetails'
import ReviewMang from './reviewmang/ReviewMang'
import UserMagReg from './User Managment/UserMagReg'
import UserManagement from './User Managment/UserManagement'

const Index = () => {
    const history = useHistory();

    useEffect(() => {
        if (Auth.isUserAuthenticated()) {
            ApiGet('admin/validate')
                .then((res) => {
                    // history.push("/dashboard");
                })
                .catch((error) => {
                    history.push("/")
                })
        } else {
            history.push("/");
        }
    }, [])

    return (
        <>
            <Switch>
                <RouteWrapper exact={true} path="/user-management" component={UserManagement} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/itinerary-management" component={ItineraryMng} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/itinerary-management-reg/:id?" component={ItineraryMngReg} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/hosted-itinery" component={HostedItinery} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/hosted-itinerary-details/:id" component={Hosteditinerarydetails} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/applied-host" component={AppliedHost} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/applied-Hosting-History/:id" component={AppliedHostingHistory} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/review-mang" component={ReviewMang} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/review-details/:id" component={ReviewDetails} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/faq" component={Faq} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/register-Faq" component={RegisterFaq} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/edit-Faq/:id" component={RegisterFaq} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/notice" component={Notice} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/edit-notice/:id" component={RegisterNotice} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/register-notice" component={RegisterNotice} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/Itinerary-Mng-db" component={ItineraryMngDB} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/Itinerary-mngDB-reg/:id" component={ItineraryMngDBReg} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/user-management-edit/:id" component={UserMagReg} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/user-management-reg" component={UserMagReg} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/review-details" component={ReviewDetails} layout={Layouts} isPrivateRoute={true} />
                <RouteWrapper exact={true} path="/user_mag_reg" component={UserMagReg} layout={Layouts} isPrivateRoute={true}/>    
                {Auth.isUserAuthenticated() ?
                    <RouteWrapper exact={true} path="/" component={Dashboard} layout={Layouts} isPrivateRoute={true} />
                    :
                    <RouteWrapper exact={true} path="/" component={Login} layout={LogRegLayout} isPrivateRoute={false} />
                }

                <Redirect from="*" to="/" />
            </Switch>
          
        </>
    )
}

export default Index;

interface RouteWrapperProps {
    component: any;
    layout: any;
    exact: boolean;
    path: string;
    isPrivateRoute: boolean;
}

function RouteWrapper({
    component: Component,
    layout: Layout,
    isPrivateRoute,
    ...rest
}: RouteWrapperProps) {
    
    const isAuthenticated: boolean = isPrivateRoute ? Auth.isUserAuthenticated() : true;
    return (
        <>
            {isAuthenticated ?
                (
                    <Route {...rest} render={(props) =>
                        <Layout>
                            
                                <Component {...props} />
                            
                        </Layout>
                    } />
                )
                : null
            }
        </>
    );
}