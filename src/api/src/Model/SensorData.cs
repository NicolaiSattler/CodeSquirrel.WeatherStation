using System;

namespace api
{
    public class SensorData
    {
        public int ID { get; set; }

        public double Temperature { get; set; }

        public double Humidity { get; set; }

        public DateTime DateTime { get; set; }
    }
}
