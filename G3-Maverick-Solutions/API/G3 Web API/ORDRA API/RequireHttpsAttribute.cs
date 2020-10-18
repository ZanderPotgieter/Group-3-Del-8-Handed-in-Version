using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;


namespace ORDRA_API
{
    public class RequireHttpsAttribute : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if(actionContext.Request.RequestUri.Scheme != Uri.UriSchemeHttps)
            {
                actionContext.Response = actionContext.Request.CreateResponse(System.Net.HttpStatusCode.Found);
                actionContext.Response.Content = new StringContent("<p>Use HTTPS instead of HTTP");

                UriBuilder UriBuilder = new UriBuilder(actionContext.Request.RequestUri);
                UriBuilder.Scheme = Uri.UriSchemeHttps;
                UriBuilder.Port = 44399;

                actionContext.Response.Headers.Location = UriBuilder.Uri;
            }
            else
            {
                base.OnAuthorization(actionContext);
            }
            
        }
    }
}