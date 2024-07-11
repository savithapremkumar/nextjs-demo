import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A first meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
//     address: "some addresss",
//     description: "This is a first meetup",
//   },
//   {
//     id: "m2",
//     title: "A second meetup",
//     image:
//       "/https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
//     address: "some addresss",
//     description: "This is a second meetup",
//   },
// ];
function HomePage(props) {
  //   const [loadedMeetups, setLoadedMeetups] = useState([]);
  //   useEffect(() => {
  //     setLoadedMeetups(DUMMY_MEETUPS);
  //   }, []);
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />;
    </>
  );
}

//render page on server fresh for each request
/*export async function getServerSideProps(context) {
  //work with incoming request
  const req = context.req;
  const res = context.res;
  //fetch data from an API
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
}*/
export async function getStaticProps() {
  // this part is executed before the component is first rendered, and during the build process, so pre-rendering works fully by generating all content of the page in the first render
  // fetch data from an API, file system reading, etc.
  //this is data fetching for pre-rendering
  // this technique is called SSG , static site generation, pages completely generated at build time

  const client = await MongoClient.connect(
    "mongodb+srv://savithapremkumar:yVJ4IeJKCShEGpiW@cluster0.yncnipn.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        id: meetup._id.toString(),
      })),
    },
    //setting revalidate makes it incremental SSG, where the page is regenerated on the server every x secs if there are incoming requests for the page
    revalidate: 1,
  };
}

export default HomePage;
