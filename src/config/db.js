/*

    Helper file to store every method & object related to make DB requests. 

    Includes:
        - The Client to connect to Serverless MongoDB Stitch provider (hosted through AWS/MongoDB-Atlas).
        - Database & collection objects configured previously on Stitch Cloud service.
        - Methods to retrieve all, edit & complete a task, creation and deletion. 

    Authentication is anonymous, (session lasts for the duration of the Browser Window).
    All documents are shared among all users with no special privileges.

    TODO:
        - Configure a collection schema on MongoDB.
        - Add authentication and a document owner_id.
        - Set priviliges for each field, based on the owner_id field. 
        - Get by ID method.

    Additional
        ORM - Mongoose Support:
            - Issues with unmaintained, deprecated or broken features from the library are relatively common.
            - It easily allows the design of DB architectures that are not in line with a NoSQL paradigm.
            - I hope, the benefits that come from using an ORM can be supplied through TypeScript.

        Server Side Rendering:
            - There is documented evidence that MongoDB Stitch has issues using providers as Next. (Attribuition pending)
        
        Stitch Documentation: https://docs.mongodb.com/stitch/

*/


import {
    RemoteMongoClient,
    Stitch,
	BSON
} from 'mongodb-stitch-browser-sdk'



export const client = Stitch.initializeDefaultAppClient('pyro-ylgqn')
const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('Pyro')
const collection = db.collection('Fields')


export const get_tasks = () => collection.find({}, { limit: 100 }).asArray()
.catch(console.log)


export const post_task = new_doc => collection
.insertOne(new_doc)
.then(({ insertedId })=>({...new_doc, _id: insertedId}))
.catch(console.log)


export const put_task = ({_id, ...doc}) => collection.updateOne(
    { _id: new BSON.ObjectID(_id)}, 
    {$set: doc}, 
    {upsert: false}
).then(d=> console.log(d))
.catch(console.log)


export const patch_task = ({completed, ...task}) => collection.updateOne(
    { _id: new BSON.ObjectID(task._id)}, 
    { $set: { completed: !completed }}, 
    { upsert: false }
).then(()=> ({...task, completed:!completed}))
.catch(console.log)


export const delete_task = ({ _id }) => collection
.deleteOne({_id: new BSON.ObjectID(_id)})
.catch(console.log)


/*

    Disclaimer:

    On Error Handling:
        * Currently the errors are handled only by logging them to the console.
        * The prefered approach would be to use a stand-alone Newtowrk Generator.
        * This would allow, a uniform treatment of data responses and errors.
        * This also simplifies the emission of events to product intelligence platforms (Amplitude).
        * In the past, I've found very useful introducing log collection libraries, my favorite:
            https://sentry.io/welcome/

    
    On Linitng:
        * This documents provides a good example on why a linting system would improve readablity.
        * I prefer to use non-coercitive rules.

*/
