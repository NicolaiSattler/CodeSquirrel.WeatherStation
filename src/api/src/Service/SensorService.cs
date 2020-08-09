using System;
using System.Collections.Generic;
using System.Reflection;
using Microsoft.Data.Sqlite;

namespace api {
    public class SensorService : ISensorService
    {
        private const string db_path = "/home/nieksa/source/Code/squirreltree_weatherstation/api/data/CODE_SQUIRREL.db";
        private const string SELECT_QUERY = "SELECT * FROM DHT22";
        private const string SELECT_TOP100 = "SELECT * FROM DHT22 LIMIT 100";

        public SensorService () { }

        public IEnumerable<SensorData> GetData () {
            var result = new List<SensorData> ();
            var conStringBuilder = new SqliteConnectionStringBuilder { DataSource = db_path };

            using (var connection = new SqliteConnection (conStringBuilder.ConnectionString)) 
            {
                var select = connection.CreateCommand();
                select.CommandText = SELECT_QUERY;

                var ass = Assembly.GetExecutingAssembly();

                connection.Open();

                using (var reader = select.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var item = new SensorData
                        {
                            ID = Convert.ToInt32(reader["ID"]),
                            Temperature = Convert.ToDouble(reader["TEMPERATURE"]),
                            Humidity = Convert.ToDouble(reader["HUMIDITY"]),
                            DateTime = new DateTime(Convert.ToInt32(reader["TICK"]), DateTimeKind.Utc)
                        };

                        result.Add(item);
                    }
                }
            }
            return result;
        }
    }
}