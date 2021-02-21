/*
 * APICloud JavaScript Library
 * Copyright (c) 2014 apicloud.com
 */
const $kn = {
    byId(id) {
        return document.getElementById(id);
    },
    ajax(p, callback) {
        var param = p;
        if (!param.headers) {
            param.headers = {};
        }
        var tokenInfo = this.getTokenInfo()
        if (tokenInfo && tokenInfo != ""){
            param.headers['Authorization']=tokenInfo['tokenHead']+tokenInfo['token']
        }
        // param.headers['Authorization']='Bearer%20eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImNyZWF0ZWQiOjE2MTM5MDk4MDQ3OTAsImV4cCI6MTYxNDUxNDYwNH0.ZFbDx5tM9NmmRGBpGvD1LDi65Silpr4AcwjRANUHrAfrxR3rxa18IdogksgxmTQ8EUK8CnyY45Q-vLKDK7f6rg'
        if (param.data && param.data.body) {
            param.headers['Accept'] = 'application/json';
            param.headers['Content-Type'] = 'application/json; charset=utf-8';
        }
        if (param.url) {
            // var baseUrl = 'https://a8888888888888-pd.apicloud-saas.com/api/';
            var baseUrl = 'http://49.233.117.149:8083/';
            param.url = baseUrl + param.url;
        }

        // api.toast({
        //     msg: JSON.stringify(param),
        //     duration: 1000*3,
        //     location: 'top',
        //     global: true
        // });
        api.ajax(param, (ret, err)=> {
            if (callback) callback(ret, err);
            if (ret) {
                var status =  ret.status;
                if (status && status == 401) {
                    var didShowLogoutAlert = api.getGlobalData({
                        key: 'didShowLogoutAlert'
                    });
                    if (!didShowLogoutAlert) {
                        api.setGlobalData({
                            key: 'didShowLogoutAlert',
                            value: true
                        });

                        this.setTokenInfo('');
                        api.alert({
                            msg: '登录已失效，请重新登录'
                        }, function() {
                            api.setGlobalData({
                                key: 'didShowLogoutAlert',
                                value: false
                            });
                            api.closeToWin({
                                name: 'root'
                            });
                        });
                    }
                }
            }
        });
    },
    toIndex(){
        var param = {
            name: 'tab',
            title: 'tabBar',
            bgColor:'#fff',
            slidBackEnabled: false,
            tabBar: {
                index: 1,
                animated: true,
                list: [
                    {
                          text: "商品",
                        iconPath: "widget://icon/nav_goods.png",
                          selectedIconPath: "widget://icon/nav_goods_on.png"
                    }, {
                          text: "订单",
                          iconPath: "widget://icon/nav_order.png",
                          selectedIconPath: "widget://icon/nav_order_on.png"
                    }, {
                          text: "我的",
                          iconPath: "widget://icon/nav_my.png",
                          selectedIconPath: "widget://icon/nav_my_on.png"
                    }
                ],
                frames: [
                    {
                        title: "商品",//tab切换时对应的标题
                        name: "goods",
                        url: "../goods/main.stml",
                        //其他继承自openFrame的参数
                    }, {
                        title: "订单",
                        name: "order",
                        url: "../order/main.stml"
                        //其他继承自openFrame的参数
                    }, {
                        title: "我的",
                        name: "my",
                        url: "../my/main.stml"
                        //其他继承自openFrame的参数
                    }
                ]
              }
        }
        try{
            api.openTabLayout(param);
        }catch(e){
            this.toast(e);
        }
    },
    getTokenInfo(){
        var value = api.getPrefs({
            key: 'tokenInfo',
            sync: true
        });
        return value?JSON.parse(value):'';
    },
    setTokenInfo(tokenInfo){
        api.setPrefs({
            key: 'tokenInfo',
            value: JSON.stringify(tokenInfo)
        });  
    },
    getUserInfo() {
        var value = api.getPrefs({
            key: 'userInfo',
            sync: true
        });
        return value?JSON.parse(value):'';
    },
    setUserInfo(userInfo) {
        api.setPrefs({
            key: 'userInfo',
            value: userInfo
        });
    },
    getCurrentCityInfo() {
        var value = api.getPrefs({
            key: 'currentCity',
            sync: true
        });
        return value?JSON.parse(value):'';
    },
    setCurrentCityInfo(cityInfo) {
        api.setPrefs({
            key: 'currentCity',
            value: cityInfo
        });
    },
    getWareTypeList() {
        var value = api.readFile({
            sync: true,
            path: 'fs://WareTypeList'
        });
        return value?JSON.parse(value):'';
    },
    setWareTypeList(list) {
        api.writeFile({
            path: 'fs://WareTypeList',
            data: JSON.stringify(list)
        });
    },
    fitRichText(richtext, width){
        var str = `<img style="max-width:${width}px;"`;
        var result = richtext.replace(/\<img/gi, str);
        return result;
    }
};
export default $kn;