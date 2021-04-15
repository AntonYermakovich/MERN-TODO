const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/todo', require('./routes/todo.route'))

console.log('Hello')

async function start() {
	try {
		await mongoose.connect('mongodb+srv://tony:12345@cluster0.mxymm.azure.mongodb.net/todo?retryWrites=true&w=majority', {
			useCreateIndex: true,
			useFindAndModify: true,
			useNewUrlParser: true,
			useUnifiedTopology: true
		})

		app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	} catch (e) { console.log(e) }
}

start()