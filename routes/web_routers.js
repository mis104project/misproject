var express = require('express');
var router = express.Router();

var signController = require('../controllers/register');
var signinController = require('../controllers/signin');
var taskController = require('../controllers/task');


/* 顯示登入頁面 */
router.get('/', function (req, res) {
    res.render('index');
});

/* 顯示首頁 */
router.get('/home', function (req, res) {
    res.render('home');
});

/* 提交登入內容 */
router.post('/', signinController.signin);

/* 登出 */
router.get('/signout', signinController.signout);

/* 顯示註冊頁面 */
router.get('/register', signController.showRegister);

/* 提交註冊內容 */
router.post('/register', signController.register);

/* 顯示task頁面 */
router.get('/all-task', taskController.showTask);

/* 顯示user新增task頁面 */
router.get('/new-task', taskController.showAddTask);

/* 提交task內容 */
router.post('/new-task', taskController.task);

/* tasker接取任務 */
router.post('/request', taskController.request);

/* user同意tasker接取任務 */

router.get('/all-task/:tid',taskController.detail);

/* 顯示個人資料頁面 */
router.get('/member/:mid',signController.showmember);

/* 顯示個人資料細節頁面 */
router.get('/edit/:mid',signController.showEdit);

/* 提交編輯之個人資料 */
router.post('/edit/:mid',signController.editMember);

/* user同意tasker接取任務 */
router.post('/accept', taskController.accept);

/* user不同意tasker接取任務 */
router.post('/decline', taskController.decline);

/* 顯示已被tasker接取任務 */
router.get('/accept-task',taskController.accept_tasks);




module.exports = router;