import React, { Component } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import Header from 'components/header/Header.js';
import Footer from 'components/footer/Footer.js';
import Register from 'components/auth/Register.js';
import Login from 'components/auth/Login.js';
import Forgot from 'components/auth/Forgot.js';
import Reset from 'components/auth/Reset.js';
import Home from 'components/home/Home.js';
import Me from 'components/me/Me.js';
import UpdateMe from 'components/me/UpdateMe.js';
import Classroom from 'components/classroom/Classroom.js';
import Device from 'components/device/Device.js';
import Report from 'components/report/Report.js';
import ReportListView from 'components/report/ReportListView.js';
import ReportPageView from 'components/report/ReportPageView.js';
import Admin from 'components/admin/Admin.js';
import PublicRoute from './PublicRoute.js';
import PrivateRoute from './PrivateRoute.js';
import AdminRoute from './AdminRoute.js';
import { AuthContext, AdminContext, getAuth, isAdmin } from "components/auth/auth.js";
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.authStatus = this.authStatus.bind(this);
        this.setAuth = this.setAuth.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
        this.state = {
            isAuth: null,
            isAdmin: null
        };
        this.saveState = (page, state) => {
            this.setState({
                [page]: state
            });
        };
        this.restoreState = (page) => {
            return this.state[page];
        };
    }

    componentDidMount() {
        this.authStatus();
    }

    authStatus() {
        let res = getAuth();

        res.then(data => {
            this.setState({
                isAuth: data.active,
                isAdmin: isAdmin()
            });
        });
    };

    setAuth(auth, admin) {
        this.setState({
            isAuth: auth,
            isAdmin: admin
        });
    };

    isLoggedIn() {
        return localStorage.getItem("person");
    };

    render() {
        const { isAuth } = this.state;
        const { isAdmin } = this.state;
        const { setAuth } = this;
        const { isLoggedIn } = this;

        return (
            <AuthContext.Provider value={ { isAuth, setAuth, isLoggedIn } }>
                <AdminContext.Provider value={ { isAdmin } }>
                    <Router>
                        <div className="App">
                            <Header />
                            <div className="page-wrapper">
                                <Switch>
                                    <PrivateRoute exact path="/" component={Home} save={this.saveState} restore={this.restoreState} />
                                    <PublicRoute exact path="/register" component={Register} />
                                    <PublicRoute exact path="/login" component={Login} />
                                    <PublicRoute exact path="/forgot" component={Forgot} />
                                    <PublicRoute exact path="/reset/:token?" component={Reset} />
                                    <PrivateRoute exact path="/me" component={Me} />
                                    <PrivateRoute exact path="/me/update" component={UpdateMe} />
                                    <PrivateRoute exact path="/device" component={Device} />
                                    <PrivateRoute exact path="/classroom" component={Classroom} />
                                    <PrivateRoute exact path="/report" component={Report} />
                                    <PrivateRoute exact path="/report/list" component={ReportListView} />
                                    <PrivateRoute exact path="/report/page/:id?/:itemGroup?/:itemid?" component={ReportPageView} />
                                    <AdminRoute exact path="/admin/:selected?/:admin?/:id?" component={Admin} save={this.saveState} restore={this.restoreState} />
                                </Switch>
                            </div>
                            <Footer />
                        </div>
                    </Router>
                </AdminContext.Provider>
            </AuthContext.Provider>
        );
    }
}

export default App;
