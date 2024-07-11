// /api/new-meetup
// POST /api/new-meetup
import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    //const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      "mongodb+srv://savithapremkumar:yVJ4IeJKCShEGpiW@cluster0.yncnipn.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0"
    );
    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data);
    client.close();
    res.status(201).json({ message: "Meetup inserted" });
  }
}
export default handler;
