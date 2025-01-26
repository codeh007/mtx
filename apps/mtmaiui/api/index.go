package handler

/* ************************************************************
依赖 GIT_CREDENTIALS 和GOPRIVATE 这两个 build 环境变量
***************************************************************/
import (
	"context"
	"fmt"
	"net/http"

	"github.com/codeh007/gomtm/mtm/server"
)

var serverApp *server.MtmBaseApp

func Handler(w http.ResponseWriter, r *http.Request) {
	if serverApp == nil {
		serverApp = server.NewMtmBaseApp()
		if err := serverApp.SetupBase(context.Background()); err != nil {
			panic(fmt.Errorf("serverApp.SetupBase error: %w", err))
		}
	}
	serverApp.ServeHTTP(w, r)
}
