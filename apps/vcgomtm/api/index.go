package handler

/* ************************************************************
关于 golang 私有模块在 vercel 中部署的配置
仅需要：
	GIT_CREDENTIALS 这个build 环境变量
***************************************************************/

import (
	"context"
	"net/http"

	"github.com/codeh007/gomtm/mtm/server"
	"github.com/pkg/errors"
)

var serverApp *server.MtmBaseApp

func Handler(w http.ResponseWriter, r *http.Request) {
	if serverApp == nil {
		// fmt.Println("serverApp == nil")
		serverApp = server.NewMtmBaseApp(nil)
		if err := serverApp.SetupBase(context.Background()); err != nil {
			// fmt.Println("serverApp.SetupBase error", err)
			panic(errors.Wrap(err, "serverApp.SetupBase error"))
		}
	}

	// fmt.Println("serverApp", serverApp)
	serverApp.ServeHTTP(w, r)
}
