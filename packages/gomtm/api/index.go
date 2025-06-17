package handler

/* ************************************************************
依赖 GIT_CREDENTIALS 和GOPRIVATE 这两个 build 环境变量
***************************************************************/

import (
	"net/http"

	"github.com/codeh007/gomtm/mtm/server"
)

var httpHandler http.Handler

func Handler(w http.ResponseWriter, r *http.Request) {
	if httpHandler == nil {
		httpHandler = server.NewVercelApiHttpHandler()
	}
	//
	httpHandler.ServeHTTP(w, r)
}
