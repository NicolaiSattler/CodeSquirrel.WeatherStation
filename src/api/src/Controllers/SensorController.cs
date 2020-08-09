using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace api.Controllers
{
    [ApiController, EnableCors("AllowSpecificOrigin"), Route("[controller]")]
    public class SensorController : ControllerBase
    {
        private readonly ISensorService _service; 

        public SensorController(ISensorService service)
        {
            _service = service;
        }

        [HttpGet]
        public IEnumerable<SensorData> Get()
        {
            return _service.GetData();
        }
    }
}
