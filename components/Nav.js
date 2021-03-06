'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';
import {appFullTitle, appShortTitle, enableAuthentication, enableDynamicReactorConfiguration,enableDynamicServerConfiguration,enableDynamicfacetsConfiguration, configDatasetURI} from '../configs/general';

class Nav extends React.Component {
    componentDidMount(){
        let currentComp = this.refs.defaultNavbar;
        $(currentComp).find('.ui.dropdown').dropdown();
    }
    showHelpModal() {
        /*global $*/
        $('.ui.modal').modal('show');
    }
    render() {
        let user = this.context.getUser();
        // console.log(user);
        let userMenu;
        let configMenu = <a href={'/browse/' + encodeURIComponent(configDatasetURI)} className="ui item link" title="Configuration Manager">
            <i className="ui black settings icon"></i>
        </a>;
        if(enableAuthentication){
            if(user){
                userMenu = <div className="ui right dropdown item">
                                {user.accountName} <i className="dropdown icon"></i>
                                <div className="menu">
                                    <NavLink className="item" routeName="resource" href={'/dataset/' + encodeURIComponent(user.datasetURI) + '/resource/' + encodeURIComponent(user.id)}>Profile</NavLink>
                                    {parseInt(user.isSuperUser) ? <NavLink className="item" routeName="users" href="/users">Users List</NavLink> : ''}
                                    <a href="/logout" className="item">Logout</a>
                                </div>
                            </div>;
            }else{
                userMenu = <div className="ui right item"> <a className="ui mini circular teal button" href="/login">Sign-in</a> </div>;
                configMenu = '';
            }
        }
        return (
            <nav ref="defaultNavbar" className="ui orange pointed menu inverted navbar page grid">
                    <NavLink routeName="home" className="brand item" href='/'>
                        {this.props.loading ? <img src="/assets/img/loader.gif" alt="loading..." style={{height: 30, width: 30}} /> : <img style={{height: 22, width: 22}} className="ui image" src="/assets/img/frank.png" alt="frank" />}
                    </NavLink>
                    <NavLink routeName="about" className="item">About</NavLink>
                    <div className="right menu">
                        <div className="item link" onClick={this.showHelpModal}>
                                <i className="small help circle icon"></i>
                        </div>
                        {(enableDynamicReactorConfiguration || enableDynamicServerConfiguration || enableDynamicfacetsConfiguration) ?
                            configMenu
                        : ''}
                        <a href="http://github.com/ali1k/frank" className="ui item link">
                                <i className="github circle icon"></i> Github
                        </a>
                        {userMenu}
                    </div>
            </nav>
        );
    }
}
Nav.contextTypes = {
    getUser: React.PropTypes.func
};
export default Nav;
