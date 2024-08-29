use mydatabase

db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["importantDates"],
            properties: {
                importantDates: {
                    bsonType: "array",
                    required: ["date", "notificationSent"],
                    items: