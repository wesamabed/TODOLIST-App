const express = require('express');
const app = express();
app.use(express.json());
const users = require('./users.json');
app.listen(3000,()=>
{
    console.log('server is runing on');
});
app.get('/users',(req,res)=>
{
    res.json(users);
});

app.post('/user',(req,res)=>
{
    const user = req.body;
    users.push(user);
    res.send('user add success');
});

app.delete('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === userId);
    if (index > -1) {
        users.splice(index, 1);
        res.send(`User with ID ${userId} deleted successfully`);
    } else {
        res.status(404).send('User not found');
    }
});

app.put('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    const index = users.findIndex(u => u.id === userId);
    if (index > -1) {
        users[index] = { ...users[index], ...updatedUser };
        res.send(`User with ID ${userId} updated successfully`);
    } else {
        res.status(404).send('User not found');
    }
});