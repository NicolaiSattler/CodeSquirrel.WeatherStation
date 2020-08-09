using System.Collections.Generic;

namespace api
{
    public interface ISensorService
    {
        IEnumerable<SensorData> GetData();
    }
}