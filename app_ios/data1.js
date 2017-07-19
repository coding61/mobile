let chatdata = {
    "1": [
        {
            "message": "欢迎参加程序媛计划之Python语言学习。"
        },
        {
            "message": "Python是一种解释型、面向对象、动态数据类型的高级程序设计语言。",
            "action": "面向对象？我妈不让我早恋啊斌叔555...",
            "chapter": 1,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/1-1.png-280x318"
        },
        {
            "message": "斌叔吐出一口老血，这里的对象不是谈的那个对象！"
        },
        {
            "message": "这里的对象是Object，它是我们要研究的任何事物，从简单的数字到复杂的机器人等，Python就是面向这些对象来解决各种问题",
            "action": "原来是这样，那么什么叫解释型啊？",
            "chapter": 2,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "解释型就代表：Python在开发过程中没有了编译这个环节。类似于PHP和Perl语言"
        },
        {
            "message": "这些繁琐的概念我就不啰嗦了，随着学习的深入慢慢就明白了，估计再说几个你就晕了",
            "action": "现在就有点晕了",
            "chapter": 3,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/1-2.jpg-300x300"
        },
        {
            "message": "不要怕，Python是非常强大的，它不仅能用于简单的文字处理，还能用于www浏览器，甚至是游戏中"
        },
        {
            "message": "像我们平时使用的App的后台，大部分都是由Python编写的"
        },
        {
            "message": "对了，现在你看到的这个程序媛网站的后台也是由Python完成的！",
            "action": "好腻害，我等不及要学了",
            "chapter": 4,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "好，Python还有2秒到达战场，我们先来看下Python环境的搭建"
        },
        {
            "message": "如果你用的是Mac电脑，那么很方便Mac已经自带了Python环境，要是Windows的话就稍微麻烦一点点"
        },
        {
            "message": "你的电脑是什么系统呢？A: Mac; B: Windows",
            "action": [
                {
                    "type": "text",
                    "content": "A"
                },
                {
                    "type": "text",
                    "content": "B"
                }
            ],
            "answer": "A",
            "exercises": true,
            "wrong": [
                {
                    "message": "好，我们需要下载Windows平台下的安装包",
                    "action": "去哪下载呢？",
                    "chapter": 5,
                    "zuan_number": 1,
                    "grow_number": 10
                },
                {
                    "message": "http://www.cnblogs.com/rocky132465/p/6106074.html"
                },
                {
                    "message": "复制这个地址在浏览器打开，里面有详细的步骤，因为我们的课程是基于2.7的语法展开的，所以安装2.7.x的版本即可",
                    "action": "顺利完成",
                    "chapter": 6,
                    "zuan_number": 1,
                    "grow_number": 20
                }
            ],
            "correct": [
                {
                    "message": "太好了，我们不用在环境配置上耽误时间了"
                },
                {
                    "message": "打开终端输入python，你会看到"
                },
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/1-3.png-588x248",
                    "action": "感觉好高端啊",
                    "chapter": 5,
                    "zuan_number": 1,
                    "grow_number": 10
                },
                {
                    "message": "我们的课程是基于Python2.7版本的，如果今后你想用3.0版本的，要注意语法可能有些许差别，但大体思想相同",
                    "action": "收到！",
                    "chapter": 6,
                    "zuan_number": 1,
                    "grow_number": 20
                }
            ]
        },
        {
            "message": "环境问题攻克之后，我们要下载一个编辑器用来编写代码，推荐Sublime或者Atom，其他的也可"
        },
        {
            "message": "老师以Mac系统为例，在编辑器中创建一个新文件，保存为.py格式，这代表它是一个Python文件。编写如下代码并保存"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/1-5.png-360x150",
            "action": "这些都是什么意思啊？",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "勤学好问，值得表扬👍"
        },
        {
            "message": "第一行就是指出这个脚本文件要用什么可执行程序去运行它，第二行是让我们的程序支持中文"
        },
        {
            "message": "print是打印的意思，也就是说我们的程序运行后会打印(输出)Hello",
            "action": "原来是这样",
            "chapter": 8,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/1-7.jpg-250x248"
        },
        {
            "message":"运行时，mac和windows有一些差别",
            "action": "知道了"
        },
        {
            "message": "mac系统步骤如下：请点击屏幕右上角的搜索按钮，如图"
        },
        {
            "img": "https://static1.bcjiaoyu.com/cxy/python/20-13.jpg-682x618"
        },
        {
            "message": "然后在搜索框中输入Terminal，这时会出现终端，点击终端。"
        },
        {
            "img": "https://static1.bcjiaoyu.com/cxy/python/20-14.jpg-1598x702"
        },
        {
            "message": "然后就会出现如图的终端界面。我们在这个界面里输入命令运行python程序。"
        },
        {
            "img": "https://static1.bcjiaoyu.com/cxy/python/20-15.jpg-1168x732",
            "action": "知道了"
        },
        {
            "message": "首先输入  chmod 777 ./Desktop/test.py  (./Desktop/test.py 指的是我存放在桌面上名为test.py的文件，根据你的命名和保存目录要做对应修改)"
        },
        {
            "message": "./Desktop/test.py  (执行这个脚本文件)"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/1-6.png-424x265",
            "action": "如果在windows环境下呢？"
        },
        {
            "message": "如果你是windows电脑，点击开始在搜索程序和文件的输入框中输入cmd,敲一下回车，你会看到"
        },
        {   
            "img": "https://static1.bcjiaoyu.com/cxy/python/20-16.png-400x604"
        },
        {
            "message": "点击这个cmd.exe就可以打开终端了",
            "action": "哦"
        },
        {   
            "img": "https://static1.bcjiaoyu.com/cxy/python/20-17.jpg-677x442"
        },
        {
            "message": "然后需要在终端中输入：python+空格+你文件的目录来运行，像这样"
        },
        {
            "img": "https://static1.bcjiaoyu.com/cxy/python/20-18.jpg-677x442"
        },
        {
            "message": "如果出错，需要回去检查一下环境变量是否设置正确"
        },
        {
            "message": "当然了，这种方式在mac里也同样适用，但都要注意路径和文件名不要写错"
        },
        {
            "message": "看它输出了我们编写的Hello,怎么样你成功了么？",
            "action": [
                {
                    "type": "text",
                    "content": "Yes"
                },
                {
                    "type": "text",
                    "content": "No"
                }
            ],
            "answer": "Yes",
            "exercises": true,
            "wrong": [
                {
                    "message": "哦，别灰心，检查下代码编写有无错误，还有目录是否正确，再试几次，失败是成功之母！",
                    "action": "好的，我会努力的💪",
                    "chapter": 9,
                    "zuan_number": 1,
                    "grow_number": 20
                }
            ],
            "correct": [
                {
                    "message": "Very good!👍",
                    "action": "多谢夸奖🤝",
                    "chapter": 9,
                    "zuan_number": 1,
                    "grow_number": 20
                }
            ]
        },
        {
            "message": "我们第一节课到这里就结束了，这节课了解了Python环境还有如何用Python打印一句话，接下来会有更难的任务等着你完成"
        },
        {
            "message": "斌叔先喝杯茶下节课再讲！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/1-13.gif-300x194",
            "action": "打卡上车，老司机带带我！",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "2": [
        {
            "message": "小橙子斌叔课堂开课了，孩子淘气不听话，多半是惯的，揍一顿就好了😈",
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-1.jpg-320x321"
        },
        {
            "message": "哈哈，还记得上节课讲了什么吗？",
            "action": "不记得了",
            "chapter": 1,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-2.jpg-400x293"
        },
        {
            "message": "上次介绍了Python语言，环境的配置，和如何通过Python打印一句话，仔细回忆一下！",
            "action": "逗你的，我记得",
            "chapter": 2,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-3.png-326x299"
        },
        {
            "message": "这节课我们来学习一下Python的变量类型和运算符"
        },
        {
            "message": "变量是存储在内存中的值，它可以指定不同的数据类型，因此这些变量可以存储整数，小数或字符等"
        },
        {
            "message": "Python有五个标准的数据类型：Numbers(数字)，String(字符串)，List(列表)，Tuple(元组)和Dictionary(字典)"
        },
        {
            "message": "我们先简单介绍最基础的数字和字符串，剩下的在后面课程中会详细讲解",
            "action": "我要怎么样运用它们呢",
            "chapter": 3,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "莫急莫急，待为师运功"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-4.jpg-300x300"
        },
        {
            "message": "第一式，白鹤亮翅"
        },
        {
            "message": "啊呸呸，第一点，变量赋值😂",
            "action": "喂，妖妖零么？这有个老师好像疯了",
            "chapter": 4,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "淘气"
        },
        {
            "message": "Python中的变量赋值不需要类型声明，但是每个变量在使用前都必须赋值，变量赋值以后该变量才会被创建"
        },
        {
            "message": "我们用等号=给变量赋值，=左边是变量名，=右边是储存在变量中的值"
        },
        {
            "message": "这样说你可能不太明白，举个例子吧"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-5.jpg-323x426",
            "action": "药不能停啊师傅！",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "拿错了，是这个"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-6.png-361x272"
        },
        {
            "message": "这里我给三个变量进行了赋值，第一个age年龄，我给它赋值了一个整型，第二个height身高，我给它赋值了一个浮点型，第三个name姓名，赋值了一个字符串"
        },
        {
            "message": "整型和浮点型都属于数字，其中还有长整型和复数等，字符串一定要用双引号括起来"
        },
        {
            "message": "然后我们在终端运行一下这个文件看看输出了什么？"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-7.png-311x171",
            "action": "好腻害",
            "chapter": 6,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "Python还可以同时为多个变量赋值，比如a, b, c = 1, 2, 3"
        },
        {
            "message": "自己编写代码试试吧",
            "action": "OK了",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "不错不错，接下来看看字符串的操作吧，不多废话，直接上图"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-8.png-508x209"
        },
        {
            "message": "怎么样，相信你的聪明才智可以看懂吧！"
        },
        {
            "message": "什么？不明白！好我们来看看代码中#后面的部分，#代表注释，后面的话是程序员写的备注给自己和其他程序员看的，方便理解代码。"
        },
        {
            "message": "还有在代码的世界中，0代表第一个，所以str[0]就是str变量中的第一个字符"
        },
        {
            "message": "看看它会输出什么，然后自己试验一下吧！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-9.png-328x187",
            "action": "练习完成了，原来是这样",
            "chapter": 8,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-10.jpg-320x320"
        },
        {
            "message": "看你智慧过人，那么再来认识几个简单的运算符吧"
        },
        {
            "message": "运算符分为算术运算符，比较运算符，赋值运算符，逻辑运算符，位运算符等待"
        },
        {
            "message": "后面的目前还用不到，我们先看算数运算符，加减乘除中加减乘和我们学的数学是一样的，符号分别是+、-、*"
        },
        {
            "message": "就是除比较特殊",
            "action": "特殊在哪里呢？",
            "chapter": 9,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "问的好"
        },
        {
            "message": "Python2.x里，整数除整数，只能得出整数。如果要得到小数部分，需要其中一个数改成浮点数"
        },
        {
            "message": "还有两个符号要记下，%和//,%是取模，也就是得出除法的余数，//相反取的是商的整数部分"
        },
        {
            "message": "光说不练假把式，我们实际演练一下，看看我写的代码，你也可以改变数值试试"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-1.png-456x719",
            "message": "来看看它输出了什么，然后你自己仿照我的样子编写感受一下"
        },
        {
            "message": "注意在python2.7版本下，涉及到中午的输出要在引号前加上字母u，强制进行unicode编码"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-12.png-293x229",
            "action": "耶，顺利完成任务",
            "chapter": 10,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "厉害厉害，在下佩服"
        },
        {
            "message": "少侠我看你天赋异禀，在告诉你两个赋值运算符"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/2-13.jpg-300x300"
        },
        {
            "message": "判断两个数是否相等用==，不相等用!="
        },
        {
            "message": "切记切记千万不要用=判断两个数相等，知道为什么吗？",
            "action": "因为=是用来赋值的",
            "chapter": 11,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "太棒了，你又学会了一节，斌叔先喝杯茶下节课再讲！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/2-4.gif-300x194",
            "action": "你快回来，我一人承受不来...",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "3": [
        {
            "message": "咳咳，上课啦"
        },
        {
            "message": "还记得上节课讲了什么吗，不知道你有没有练习？"
        },
        {
            "message": "我要问你几个小问题，你准备好了吗？",
            "action": "请出题",
            "chapter": 1,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "请问判断两个变量是否相等的符号是什么？A: = ; B: == ",
            "action": [
                {
                    "type": "text",
                    "content": "A"
                },
                {
                    "type": "text",
                    "content": "B"
                }
            ],
            "answer": "B",
            "exercises": true,
            "wrong": [
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/3-1.jpg-300x300"
                },
                {
                    "message": "仔细回忆一下",
                    "action": "再做一次",
                    "again": true
                }
            ],
            "correct": [
                {
                    "message": "不错不错"
                },
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/3-2.jpg-440x330",
                    "action": "So easy!",
                    "chapter": 2,
                    "zuan_number": 1,
                    "grow_number": 10
                }
            ]
        },
        {
            "message": "口气不小啊，再来一题，\n a = 1 \n b = apple \n 这两个赋值语句正确吗？A：正确；B：错误",
            "action": [
                {
                    "type": "text",
                    "content": "A"
                },
                {
                    "type": "text",
                    "content": "B"
                }
            ],
            "answer": "B",
            "exercises": true,
            "wrong": [
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/3-3.jpg-200x200",
                    "action": "让我再想想",
                    "again": true
                }
            ],
            "correct": [
                {
                    "message": "看来你真的都记住了，赞👍",
                    "action": "多谢夸奖🤝是你教的好",
                    "chapter": 3,
                    "zuan_number": 1,
                    "grow_number": 10
                }
            ]
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-3.jpg-300x300"
        },
        {
            "message": "错误的原因就是因为赋值字符串时候要加上双引号，切记"
        },
        {
            "message": "这节课我们来学习下条件语句"
        },
        {
            "message": "条件语句其实非常简单，就是让计算机判断条件是对还是错。是对的，执行一段语句。如果是错的，执行另一段语句，就这么简单。"
        },
        {
            "message": "在编程中我们用if语句用于控制程序的执行，怎么样蒙圈了吧？",
            "action": "扶我起来，我还能学",
            "chapter": 4,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "我们通过个例子来看看"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/3-4.png-470x239"
        },
        {
            "message": "要注意，python程序中要遵循严格的缩进，没有缩进或缩进错误，程序都无法正确运行",
            "action": "怎么进行缩进呢？"
        },
        {
            "message": "一般判断语句后要使用缩进，4个空格或是敲一下tab键，大部分编辑器也已经替我们做了这个工作"
        },
        {
            "message": "下一节要讲的循环中，也要注意代码的缩进"
        },
        {
            "message": "来看看它的输出，然后自己试试"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/3-5.png-332x73",
            "action": "完成了！",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "嗯，很好，"
        },
        {
            "message": "那么当我们需要判断多种条件怎么办呢？"
        },
        {
            "message": "还记得JS中学过的else if么？"
        },
        {
            "message": "Python中我们用elif来判断多个条件",
            "action": "好像差不多",
            "chapter": 6,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/3-6.png-418x346",
            "message": "看看这段程序，猜猜它会输出什么？",
            "action": "我猜是apple",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "嗯，我们来看看结果，看你是否想对了"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/3-7.png-355x163"
        },
        {
            "message": "答对了，你也试着自己写个程序操作一下吧！",
            "action": "So easy,妈妈再也不用担心我的学习",
            "chapter": 8,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "哈哈，值得表扬，给你点个赞"
        },
        {
            "message": "如果需要多个条件需同时判断时，我们需要用到and和or来连接多个条件"
        },
        {
            "message": "再举个栗子🌰"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/3-8.png-418x346",
            "action": "感觉开始复杂起来了",
            "chapter": 9,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "别担心，相信你能够完成的"
        },
        {
            "message": "看一下它的输出，然后自己试试吧！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/3-9.png-308x139",
            "action": "我做好了",
            "chapter": 10,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "我就说不难吧！还有一点要注意"
        },
        {
            "message": "如果你看到条件中有用()括起来的，就意味着这括起来的优先执行。其实也没什么大不了的，用的时候就清楚啦！",
            "action": "知道了",
            "chapter": 11,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "不错不错，这节课的内容大体就是这样了,要多加练习啊",
            "action": "知道了",
            "chapter": 12,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "太棒了，你又学会了一节，课后多加练习啊，斌叔先喝杯茶下节课再讲！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/3-5.gif-300x194",
            "action": "我在这儿等着你回来...",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "4": [
        {
            "message": "Hi，又见面了。"
        },
        {
            "message": "老规矩，斌叔要提问一下上节课的内容。",
            "action": "Come on",
            "chapter": 1,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "请问Python中判断多个条件时需要用\n A.else if\n  B.elif",
            "action": [
                {
                    "type": "text",
                    "content": "A"
                },
                {
                    "type": "text",
                    "content": "B"
                }
            ],
            "answer": "B",
            "exercises": true,
            "wrong": [
                {
                    "message": "我刀呢。。"
                },
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-4.jpg-400x400",
                    "action": "再试一次！",
                    "again": true
                }
            ],
            "correct": [
                {
                    "message": "很好很好"
                },
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/4-1.jpg-240x240",
                    "action": "嘿嘿",
                    "chapter": 2,
                    "zuan_number": 1,
                    "grow_number": 10
                }
            ]
        },
        {
            "message": "那么开始新一节的学习了。"
        },
        {
            "message": "本节课我们要讲一个新知识点--循环"
        },
        {
            "message": "程序在一般情况下是按顺序执行的，循环语句允许我们执行一个语句或语句组多次"
        },
        {
            "message": "Python提供了for循环和while循环",
            "action": "这两个都是什么意思啊",
            "chapter": 3,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "while循环就是在给定的判断条件为true时执行循环体，否则退出循环体，for循环是重复执行语句"
        },
        {
            "message": "单说概念可能你不会理解，不过别急，先给你介绍一下，然后看几个例子你就明白了"
        },
        {
            "message": "循环中还有3个循环控制语句，break，continue和pass，我们先记下，接下来我们来看看它们如何使用",
            "action": "记下了，请开始你的表演",
            "chapter": 4,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-5.gif-150x150"
        },
        {
            "message": "额，献丑了"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/4-1.png-403x247"
        },
        {
            "message": "不是很复杂吧，看看它输出了什么，然后自己试一试"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/4-2.png-381x246",
            "action": "聪明的我完成了",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "不要骄傲，我们在来看看continue和break的用法"
        },
        {
            "message": "continue用于跳过该次循环，break则是用于退出循环，看下例子吧"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/4-3.png-435x384",
            "action": "有趣",
            "chapter": 6,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "其中i += 1 就等价于 i = i + 1，i%2 代表i除以2得到的余数"
        },
        {
            "message": "来看看它的结果，自己试试吧"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/4-4.png-399x349",
            "action": "我完成啦",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "棒棒的，当while后的条件永远为true时，这个循环会无限的循环下去"
        },
        {
            "message": "要想停止它，可以用CTRL+C来终止循环"
        },
        {
            "message": "好，学了while循环后，斌叔来带你做一个猜数字的小游戏",
            "action": "迫不及待",
            "chapter": 8,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-2.png-536x453"
        },
        {
            "message": "有几段代码你应该还不明白，我来讲解一下",
             "action": "好的"
        },
        {
            "message": "import random 表示导入随机数"
        },
        {
            "message": "s = int(random.uniform(1,10)) 表示设置1——10的随机数字，赋值给了s变量"
        },
        {
            "message": "m = int(input('输入整数:')) 表示设置一个输入框，把输入的数字赋值给m变量",
            "action": "这回明白了",
            "chapter": 9,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "我们看一下我的游戏结果，然后你自己写着试试吧！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/4-6.png-320x155",
            "action": "完成了，太有趣了",
            "chapter": 10,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "太棒了，你又学会了一节，斌叔先喝杯茶下节课再讲！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/4-5.gif-300x194",
            "action": "打卡，炫耀下！",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "5": [
        {
            "message": "Hello，美女"
        },
        {
            "message": "老环节，斌叔要来提问了。"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/5-1.jpg-255x255"
        },
        {
            "message": "请问用什么退出循环\n A.continue \n  B.break",
            "action": [
                {
                    "type": "text",
                    "content": "A"
                },
                {
                    "type": "text",
                    "content": "B"
                }
            ],
            "answer": "B",
            "exercises": true,
            "wrong": [
                {
                    "message": "哭…这么简单的"
                },
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/5-3.gif-200x200",
                    "action": "呜呜，我再试一次",
                    "again": true
                }
            ],
            "correct": [
                {
                    "message": "做对了题就是要这么拽"
                },
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/5-2.gif-400x275",
                    "action": "霸气侧漏",
                    "chapter": 1,
                    "zuan_number": 1,
                    "grow_number": 10
                }
            ]
        },
        {
            "message": "这次课我们来认识下for循环"
        },
        {
            "message": "for循环可以遍历任何序列的项目，如一个列表或者一个字符串"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-3.png-415x278"
        },
        {
            "message": "看看它的输出，然后自己动手试试吧！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/5-2.png-333x250",
            "action": "for循环也不是很难么",
            "chapter": 2,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "别急，难的在后面，我们还能通过序列索引迭代，像这样："
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-4.png-427x219"
        },
        {
            "message": "以上实例我们使用了内置函数len()和range(),函数len()返回列表的长度，即元素的个数，range返回一个序列的数。"
        },
        {
            "message": "看看它的输出，再来试试这样你会不会写"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/5-4.png-308x136",
            "action": "OK了",
            "chapter": 3,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "怎么样，很简单吧"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/5-5.jpg-300x300"
        },
        {
            "message": "解决很多复杂问题时，仅仅用循环是不够的，我们还需要嵌套循环",
            "action": "什么是嵌套循环啊？",
            "chapter": 4,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "就是在一个循环体里面嵌入另一个循环，说白了就是外面一个循环，里面再用一个循环"
        },
        {
            "message": "这节课先不深入讲解，如果你能学会并熟练运用本节知识的话，可以试着搜索一下相关知识预习预习"
        },
        {
            "message": "现在开始你要多动手写程序，做练习"
        },
        {
            "message": "做程序要严谨，想明白其中的逻辑，还要注意各个符号，缩进都不能出错",
            "action": "知道啦",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "现在的课程不能只靠脑袋记了，好记性不如烂笔头"
        },
        {
            "message": "我们要多敲代码练习，才能熟能生巧"
        },
        {
            "message": "关于循环我们就讲到这里了，斌叔先喝杯茶下节课再讲"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/5-8.gif-300x194",
            "action": "你怎么总喝茶，快去快回啊",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "6": [
        {
            "message": "欢迎来到斌叔的Python课堂第六节。"
        },
        {
            "message": "帅气的斌叔又来教美丽的你编程知识了。",
            "action": "哇哦～",
            "chapter": 1,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-6.jpg-300x300"
        },
        {
            "message": "我们已经学习了判断、循环，和一些基本的语法"
        },
        {
            "message": "再深入的学习一下各个数据类型的使用，我们就可以编写小程序啦"
        },
        {
            "message": "这节课让我们深入地认识一下Python中字符串的使用"
        },
        {
            "message": "还记得之前讲过怎么获取字符串中第几个字符么？",
            "action": "不记得了",
            "chapter": 2,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "那好我们来回顾一下"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-5.png-828x199",
            "action": "想起来了，0代表第一个",
            "chapter": 3,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "对，接下来我们学习一下字符串拼接"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-7.gif-150x150"
        },
        {
            "message": "我们可以通过加号+，把两个或多个字符串拼接在一起"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/17-1.png-334x212"
        },
        {
            "message": "其中a * 2代表将a这个字符串重复输出两次"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/17-2.png-360x79"
        },
        {
            "message": "看一下对应的输出，你试着遍写一个，感受一下",
            "action": "嗯，自己写了一遍，理解许多",
            "chapter": 4,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "下面还有一个运算符，就是%，它用于格式化字符串",
            "action": "什么是格式化啊？",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "Python支持格式化字符串的输出。尽管这样可能会用到非常复杂的表达式，但最基本的用法是将一个值插入到一个有字符串格式符%s的字符串中。"
        },
        {
            "message": "在Python中，字符串格式化使用与C中sprintf函数一样的语法。"
        },
        {
            "message": "说了这么多，你可能又懵了，来吃个栗子精神一下"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/6-6.png-536x135"
        },
        {
            "message": "这段代码会输出I am a girl and my height is 170 cm!"
        },
        {
            "message": "怎么样，懂了吧，自己动手试试吧",
            "action": "成功了",
            "chapter": 6,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "不错不错"
        },
        {
            "message": "划重点，字符串用%s，整数用%d",
            "action": "记下了",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "这节课我们重新认识了字符串，也有了深入的了解，知识点很多，课后要多敲代码练习啊",
            "action": "我猜你又要去喝茶了",
            "chapter": 8,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-8.gif-273x275"
        },
        {
            "message": "哈哈，我就不，我去喝杯咖啡，下节课再讲！拜～"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/7-4.gif-300x194",
            "action": "拜拜",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "7": [
        {
            "message": "嘿～girl"
        },
        {
            "message": "欢迎来到我的编程课堂Python第七节。"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-9.gif-150x150"
        },
        {
            "message": "现在斌叔要来提问你一下了！"
        },
        {
            "message": "是不是怕了。",
            "action": "哼，我才不怕"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/7-1.gif-320x180"
        },
        {
            "message": "好，勇气可嘉。"
        },
        {
            "message": "请问那个符号用格式化字符串？\n A.%s \n  B.%d",
            "action": [
                {
                    "type": "text",
                    "content": "A"
                },
                {
                    "type": "text",
                    "content": "B"
                }
            ],
            "answer": "A",
            "exercises": true,
            "wrong": [
                {
                    "message": "额，那你用什么来格式化整数啊？"
                },
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-10.gif-180x180",
                    "action": "对不起我再做一次！",
                    "again": true
                }
            ],
            "correct": [
                {
                    "message": "答对啦",
                    "action": "嘿嘿，就是厉害",
                    "chapter": 1,
                    "zuan_number": 1,
                    "grow_number": 10
                }
            ]
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-12.gif-380x408"
        },
        {
            "message": "很好，那开始我们本小节"
        },
        {
            "message": "这堂课我们要介绍一个新朋友--列表(List)",
            "action": "请开始你的表演",
            "chapter": 2,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "说来话长了..."
        },
        {
            "message": "从前有座山，山里有座庙，庙里有个老程序员在给小程序员传授Python大法"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-13.jpg-400x400"
        },
        {
            "message": "咳咳，言归正传"
        },
        {
            "message": "说列表，要从序列说起，序列是Python中最基本的数据结构。序列中的每个元素都分配一个数字 - 它的位置，或索引，第一个索引是0，第二个索引是1，依此类推。"
        },
        {
            "message": "切记，在计算机里所有的编号，都是从0开始的！！！！！！",
            "action": "记住了"
        },
        {
            "message": "Python有6个序列的内置类型，但最常见的是列表和元组，元组我们下节课再讲，先来看列表"
        },
        {
            "message": "列表是最常用的Python数据类型，它可以作为一个方括号内的逗号分隔值出现，列表的数据项不需要具有相同的类型"
        },
        {
            "message": "也就是说我的列表里可以都是字符串，都是数字，或者既有字符串也有数字",
            "action": "我觉得你需要举个例子",
            "chapter": 3,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "好，创建一个列表，只要把逗号分隔的不同的数据项使用方括号括起来即可。如下所示"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/7-1.png-452x235"
        },
        {
            "message": "第一个是输出列表1的第一项，第二个是输出列表2的第2到5项。你来自己试试吧",
            "action": "哦了👌",
            "chapter": 4,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "学习的挺快啊"
        },
        {
            "message": "斌叔再来告诉你如何更新一个列表"
        },
        {
            "message": "我们可以对列表的数据项进行修改或更新，也可以使用append()方法来添加列表项，如下所示"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-6.png-378x244"
        },
        {
            "message": "怎么样，很简单吧，看看它的输出，然后自己动手试试"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/7-3.png-534x135",
            "action": "根本难不倒我啊，哈哈哈哈嗝",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "小样，再吃我一招----del",
            "action": "师傅，这又是什么新武功",
            "chapter": 6,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "我们学会了更新列表，而del是用来删除列表元素的技能，也就是delete的简写"
        },
        {
            "message": "直接来看看如何使用吧"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-7.png-413x206"
        },
        {
            "message": "我用del删掉了列表的第三个元素，看看输出跟你想的一样么，然后自己试试"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/7-5.png-444x124",
            "action": "小菜一碟",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "不错不错"
        },
        {
            "message": "为师要下山吃肉..额不是，下山化缘了"
        },
        {
            "message": "临走前再教你两招，在家好生修炼"
        },
        {
            "message": "我们可以用len([1,2,3])来获取一个列表的长度，"
        },
        {
            "message": "还有我们能用+加号把两个列表组合起来，就像"
        },
        {
            "message": "[1,2,3]+[4,5,6]会变成[1,2,3,4,5,6]",
            "action": "我要比你聪明比你强",
            "chapter": 8,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-14.jpg-200x200"
        },
        {
            "message": "太棒了，你又学会了一节，斌叔先喝杯茶下节课再讲！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/8-5.gif-300x194",
            "action": "see you",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "8": [
        {
            "message": "有请下一位男嘉宾闪亮登场！"
        },
        {
            "message": "噔噔的楞噔噔，Can you feel it...."
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-15.png-334x383"
        },
        {
            "message": "哈哈，斌叔出场自带bgm，我的课程非诚勿扰",
            "action": "我已经灭灯了，下一位",
            "chapter": 1,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "额额，别啊，让我们看完这段VCR"
        },
        {
            "message": "啊不是，看完这节课"
        },
        {
            "message": "还记得上次讲列表时提到了元组么？",
            "action": "好像有这回事",
            "chapter": 2,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "什么叫好像？这次我们来讲讲元组是个什么东东"
        },
        {
            "message": "Python的元组与列表类似，不同之处在于元组的元素不能修改，记住哦！下次课我会考你的"
        },
        {
            "message": "元组使用小括号，列表使用方括号。"
        },
        {
            "message": "元组创建很简单，只需要在括号中添加元素，并使用逗号隔开即可。就像这样"
        },
        {
            "message": "tup1 = ('physics', 'chemistry', 1997, 2000);"
        },
        {
            "message": "tup2 = (1, 2, 3, 4, 5 );"
        },
        {
            "message": "还可以这样tup3 = 'a', 'b', 'c', 'd';",
            "action": "还有这种操作",
            "chapter": 3,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "当我们想要创建一个空元组时，可以这样写"
        },
        {
            "message": "tup1 = ();"
        },
        {
            "message": "还有一点要注意"
        },
        {
            "message": "元组中只包含一个元素时，需要在元素后面添加逗号，例如："
        },
        {
            "message": "tup1 = (50,);"
        },
        {
            "message": "下面看完怎样来使用，然后你仿照着自己试一试"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/9-1.png-421x269",
            "action": "小意思，跟列表差不多吗！",
            "chapter": 4,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "的确很相似，下面我们来看看差异"
        },
        {
            "message": "元组中的元素值是不允许修改的，因此如果像列表一样tup[0]=100;的操作时非法的"
        },
        {
            "message": "但我们可以对元组进行连接组合"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/9-2.png-329x290",
            "action": "我来自己试试",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "好，做程序就要多动手，敲的多了，自然理解就深了"
        },
        {
            "message": "再来看元组的del"
        },
        {
            "message": "元组中的元素值是不允许删除的，但我们可以使用del语句来删除整个元组，就像这样："
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/9-3.png-404x229"
        },
        {
            "message": "将元组删除后再输出，会出现这样的错误"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/9-4.png-466x182"
        },
        {
            "message": "所以元组删除后，就不能再使用它了，你来自己试试吧！",
            "action": "难不倒我",
            "chapter": 6,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "因为我们掌握了列表，再认识元组会轻松很多"
        },
        {
            "message": "同样的元组也能用len()获取长度"
        },
        {
            "message": "我们还能这样写(100,)*4，它会输出(100,100,100,100)"
        },
        {
            "message": "列表也可以这样写",
            "action": "那你上节课怎么不告诉我",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "说多了怕你记不住吗"
        },
        {
            "message": "再来看一个小知识点，同样是元组和列表都适用的哦"
        },
        {
            "message": "我们可以这样for x in (1, 2, 3): print x,来遍历一个元组的元素",
            "action": "用法还不少呢",
            "chapter": 8,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "对啊，字符串、数字、列表等等就像是武术里的刀、枪、棍、棒"
        },
        {
            "message": "每个变量类型的用法，就像是这些武器的招式"
        },
        {
            "message": "你需要多加练习，才能在应用时得心应手",
            "action": "你怎么开启唐僧模式了，我会多加练习的",
            "chapter": 9,
            "zuan_number": 0,
            "grow_number": 20
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-16.gif-245x228"
        },
        {
            "message": "好下课，坐久了起来活动活动，劳逸结合吗"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/9-4.gif-300x194",
            "action": "下集能不能换个男嘉宾😂",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "9": [
        {
            "message": "熊大🐻，那家伙又来砍树🌲了",
            "action": "你才是光头强",
            "chapter": 1,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "哈哈"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-17.png-300x300"
        },
        {
            "message": "来吧小仙女，吃我一题"
        },
        {
            "message": "请问列表和元组有什么区别\n A:元组使用小括号，列表使用方括号\n B:元组中的元素值是不允许修改的\n C:元组中的元素值是不允许删除的 \n D:以上都对",
            "action": [
                {
                    "type": "text",
                    "content": "A"
                },
                {
                    "type": "text",
                    "content": "B"
                },
                {
                    "type": "text",
                    "content": "C"
                },
                {
                    "type": "text",
                    "content": "D"
                }
            ],
            "answer": "D",
            "exercises": true,
            "wrong": [
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/11-1.gif-200x200"
                },
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/11-2.jpg-141x162"
                },
                {
                    "message": "仔细想想",
                    "action": "嗯…",
                    "again": true
                }
            ],
            "correct": [
                {
                    "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-18.gif-300x225",
                    "action": "嘿嘿",
                    "chapter": 2,
                    "zuan_number": 1,
                    "grow_number": 10
                }
            ]
        },
        {
            "message": "那本小节斌叔要给你讲一下另外一种变量类型--字典Dictionary",
            "action": "是新华字典还是成语词典",
            "chapter": 3,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "都不是，这里的字典是另一种可变容器模型，且可存储任意类型对象。"
        },
        {
            "message": "字典的每个键值(key=>value)对用冒号(:)分割，每个对之间用逗号(,)分割，整个字典包括在花括号({})中 ,格式如下所示："
        },
        {
            "message": "d = {key1 : value1, key2 : value2 }",
            "action": "这都是啥？",
            "chapter": 4,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "可能你不太明白"
        },
        {
            "message": "我们举个例子，在生活中使用时字典，比如我们查找apple，翻到对应页码会有apple的解释--苹果"
        },
        {
            "message": "那么这个apple就是key，我们叫做键，苹果就是对应的value，叫做值",
            "action": "哦明白了",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "机智啊！！！"
        },
        {
            "message": "给你打82分，剩下18分以666的形式给你，怕你骄傲"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-19.jpg-198x198"
        },
        {
            "message": "就刚才那个例子，写成代码是这样的："
        },
        {
            "message": "dict = { 'apple': '苹果' }"
        },
        {
            "message": "要记住：键必须是唯一的，但值则不必！"
        },
        {
            "message": "值可以取任何数据类型，但键必须是不可变的，如字符串，数字或元组。"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/9-5.png-475x214"
        },
        {
            "message": "我创建了一个字典，用Name、Age、Class做为键值，并写了对应的值"
        },
        {
            "message": "然后通过键来查找对应的值，输出如下图，然后自己动手试试"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/9-6.png-354x96",
            "action": "完成了～",
            "chapter": 6,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "好，我们再来看看字典的元素如何修改和删除"
        },
        {
            "message": "还以刚才的字典为例，假如我们想修改年龄，也就是Age这个key对应的值，这样写"
        },
        {
            "message": "dict['Age'] = 8;"
        },
        {
            "message": "简单吧，添加新的键值时，比如我们要添加一个学校的键值对，这样写："
        },
        {
            "message": "dict['School'] = 'CXY School';",
            "action": "这样就可以？ 我来试一试",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "怎么样，不难吧！"
        },
        {
            "message": "那么如何删除字典元素呢"
        },
        {
            "message": "还记得列表删除元素用什么吗？",
            "action": "del",
            "chapter": 8,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "真棒"
        },
        {
            "message": "假如我们不想要key是Age的这个键值对了，我们可以"
        },
        {
            "message": "del dict['Age'];"
        },
        {
            "message": "这样这个字典里Age就不存在了"
        },
        {
            "message": "我们还可以用dict.clear();来清除整个字典"
        },
        {
            "message": "同样的，可以通过del dict;删除这个字典，不过删除后再使用这个字典就会报错，以为这个dict已经从内存中删除了"
        },
        {
            "message": "而dict.clear();后再使用dict则不会报错，因为这个字典依旧存在，只不过里面是空的",
            "action": "有点晕了，我自己试一下",
            "chapter": 9,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "关于字典的使用，有两点必须要记住"
        },
        {
            "message": "1、不允许同一个键出现两次。创建时如果同一个键被赋值两次，后一个值会被记住，如下实例："
        },
        {
            "message": "dict = {'Name': 'Zara', 'Age': 7, 'Name': 'Manni'};"
        },
        {
            "message": "这时我们如果通过dict['Name']获取值的话，将会获取'Manni',而'Zara'因为后面出现了相同的key被覆盖了"
        },
        {
            "message": "2、键必须不可变，所以可以用数字，字符串或元组充当，而列表就不行",
            "action": "徒儿记住了",
            "chapter": 10,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "字典还有很多用法，比如我们可以通过   dict.keys()以列表返回一个字典所有的键"
        },
        {
            "message": "对应的可以通过 dict.values()以列表返回一个字典所有的值"
        },
        {
            "message": "学了这么多，试着运用字典写几个笑程序吧"
        },
        {
            "message": "相信自己，动手试试吧，如果还有不明白的地方，可以在论坛里发帖，斌叔替你解答",
            "action": "我会努力练习的",
            "chapter": 11,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "加油，斌叔先去喝杯茶下节课再讲！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/10-5.gif-300x194",
            "action": "打卡，炫耀下！",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "10": [
        {
            "message": "对面的女孩看过来，看过来，看过来..."
        },
        {
            "message": "不要被我的样子吓坏，其实我...很可爱🐶",
            "action": "服务员拿个桶来，我先吐会...",
            "chapter": 1,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-21.gif-140x150"
        },
        {
            "message": "上次的练习做的怎么样啊，不懂的可以在论坛发帖提问哦"
        },
        {
            "message": "出错不要紧，多写代码，多写，多写"
        },
        {
            "message": "重要的事情说三遍"
        },
        {
            "message": "这次我们来看一下Python中日期和时间"
        },
        {
            "message": "Python提供了一个time和calendar模块可以用于格式化日期和时间。"
        },
        {
            "message": "我们先来通过time.time()用于获取当前时间戳",
            "action": "好，不过具体该怎么写呢？",
            "chapter": 2,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "还记得猜数字游戏里，我们用到了import random了么"
        },
        {
            "message": "要想使用时间相关的方法，同样要用到import"
        },
        {
            "message": "首先 import time 导入时间模块"
        },
        {
            "message": "然后 print time.time();"
        },
        {
            "message": "试一试看看出现了什么",
            "action": "类似1499938242.87这样一串数字",
            "chapter": 3,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "对，这个叫时间戳，它是从1970年1月1日午夜到现在时刻的秒数"
        },
        {
            "message": "至于为什么是1970年1月1日，斌叔这里不多讲"
        },
        {
            "message": "如果你感兴趣的话，可以通过百度、谷歌等，搜索相关知识"
        },
        {
            "message": "记住要善于通过网络获取新知识",
            "action": "好的",
            "chapter": 4,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "那么我们怎么获取能看懂的时间呢？输入下面的代码看看"
        },
        {
            "message": "print time.localtime(time.time());"
        },
        {
            "message": "怎么样出现了年月日、时分秒等信息，对吧"
        },
        {
            "message": "如果我想让它更简明些怎么办呢？比如2008-08-08 13:00:00这样的格式"
        },
        {
            "message": "print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime());"
        },
        {
            "message": "运行这段代码看看",
            "action": "好神奇耶",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "因为我们把时间信息格式化为我们想要的格式了"
        },
        {
            "message": "Python中时间日期常用的格式化符号有"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/9-10.png-349x449"
        },
        {
            "message": "Python可以用来获取日历吗？"
        },
        {
            "message": "答案是肯定的",
            "action": "哇，以后家里不用买日历啦，哈哈。",
            "chapter": 6,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "非常简单，不过先来导入日历模块，import calendar"
        },
        {
            "message": "然后，print calendar.month(2017, 7)"
        },
        {
            "message": "就会得到2017年7月份的日历了，看看我的日历，然后自己试试吧"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-8.png-772x258",
            "action": "有趣诶",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-22.png-150x150"
        },
        {
            "message": "好，这节课的知识就介绍完了"
        },
        {
            "message": "留个小作业，你能用这节课的知识，通过日历模块显示今天是星期几么？",
            "action": "好，我来试一试",
            "chapter": 8,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "给你个提示，Python时间日期格式化符号表中可能有你需要的信息哦"
        },
        {
            "message": "加油，斌叔先喝杯茶下节课再讲！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/11-5.gif-300x194",
            "action": "下次能不能把茶也给我喝一杯",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "11": [
        {
            "message": "欢迎来到斌叔的Python课堂第十一节"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-23.gif-120x96"
        },
        {
            "message": "回顾一下以前的知识吧！请听题："
        },
        {
            "message": "字典中的key和value有都什么要求？\n A: key和value都是唯一的\n B: key是唯一的\n C: key和value都不唯一",
            "action": [
                {
                    "type": "text",
                    "content": "A"
                },
                {
                    "type": "text",
                    "content": "B"
                },
                {
                    "type": "text",
                    "content": "C"
                }
            ],
            "answer": "B",
            "exercises": true,
            "wrong": [
                {
                    "message": "再想想",
                    "action": "再做一次",
                    "again": true
                }
            ],
            "correct": [
                {
                    "message": "记忆力惊人啊👍",
                    "action": "多谢夸奖🤝",
                    "chapter": 1,
                    "zuan_number": 1,
                    "grow_number": 20
                }
            ]
        },
        {
            "message": "本小节斌叔要教你一个传世武功",
            "action": "说来听听",
            "chapter": 2,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-1.jpg-240x240"
        },
        {
            "message": "JS课程里我们学习了函数对吧，Python中也有函数的实现"
        },
        {
            "message": "函数的功能可是十分强大的"
        },
        {
            "message": "我们可以把重复性的，或是用来实现某个功能的代码块，用函数封装起来"
        },
        {
            "message": "需要的时候，再来调用它，能大大的提高应用的模块性，和代码的重复利用率"
        },
        {
            "message": "像之前我们用来打印信息的print()和获取长度的len()等都是Python的内建函数"
        },
        {
            "message": "我们也可以自己创建函数，这被叫做用户自定义函数",
            "action": "具体该怎么操作呢？",
            "chapter": 3,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-2.jpg-320x313"
        },
        {
            "message": "函数代码块以 def 关键词开头，后接函数标识符名称和圆括号()。"
        },
        {
            "message": "任何传入参数和自变量必须放在圆括号中间。圆括号之间可以用于定义参数。"
        },
        {
            "message": "函数的第一行语句可以选择性地使用文档字符串—用于存放函数说明。"
        },
        {
            "message": "函数内容以冒号起始，并且缩进。如果不缩进，程序会出错"
        },
        {
            "message": "return [表达式] 结束函数，选择性地返回一个值给调用方。不带表达式的return相当于返回 None",
            "action": "你要是再叭叭这些概念我就打死你",
            "chapter": 4,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-3.jpg-580x580"
        },
        {
            "message": "惹不起惹不起"
        },
        {
            "message": "斌叔给你举个栗子🌰",
            "action": "快来讲讲",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-9.png-647x278"
        },
        {
            "message": "看，我们用def，定义了一个我的输出函数my_print，后面用my_print()调用它"
        },
        {
            "message": "这个方法打印我们传递给它的字符串"
        },
        {
            "message": "这是最简单的一个例子，你试试自己写一个",
            "action": "顺利完成",
            "chapter": 6,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "好，我们再来看‘参数传递’",
            "action": "什么是参数啊",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "还拿刚刚的程序举例"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-9.png-647x278"
        },
        {
            "message": "my_print('123'),括号内的字符串，就是我们传递的参数",
            "action": "知道了",
            "chapter": 8,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "然后，函数中用str接收了这个参数，并把它打印了出来",
            "action": "太简单了",
            "chapter": 9,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-4.jpg-580x376"
        },
        {
            "message": "说到函数，还要注意一点"
        },
        {
            "message": "函数里的参数，不要和外面的重名"
        },
        {
            "message": "Python光看不写是不会理解的，多写多想，你会越来越棒"
        },
        {
            "message": "太棒了，你又学会了一节，斌叔先喝杯茶下节课再讲！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/12-4.gif-300x194",
            "action": "天天喝茶，你不会是个卖茶叶的吧",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "12": [
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-5.jpg-300x226"
        },
        {
            "message": "上次课我们学习了函数，这次我们再来认识一个新知识点"
        },
        {
            "message": "学习完模块，我们的Python基础课程就快接近尾声了，是不是很兴奋",
            "action": "看来我要走向人生巅峰了",
            "chapter": 1,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "喂喂，醒醒，该吃药了"
        },
        {
            "message": "来下面来看看这个巅峰，啊呸，看看这个知识点"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-6.jpg-690x626",
            "action": "哈哈哈",
            "chapter": 2,
            "zuan_number": 0,
            "grow_number": 10
        },
        {
            "message": "介绍一下Python中基本的I/O函数"
        },
        {
            "message": "也就是输入和输出函数"
        },
        {
            "message": "我们之前也都使用过，最简单的就是print，将传递的表达式或字符串打印到屏幕"
        },
        {
            "message": "读取键盘输入的我们来介绍一下raw_input",
            "action": "它怎么使用呢？",
            "chapter": 3,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "raw_input([prompt]) 函数从标准输入读取一个行，并返回一个字符串（去掉结尾的换行符）"
        },
        {
            "message": "说白了就是它可以获取我们输入的话"
        },
        {
            "message": "我们来试一下"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-10.png-676x249",
            "action": "看起来很简单",
            "chapter": 4,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "看raw_input把我们写的字符串输出了，自己试着操作一下"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/17-4.png-379x85",
            "action": "的确是这样",
            "chapter": 5,
            "zuan_number": 2,
            "grow_number": 20
        },
        {
            "message": "我们编程中要根据需要，灵活使用"
        },
        {
            "message": "嗯嗯，那我们本节课就上到这里了哦！"
        },
        {
            "message": "我们讲了基本的I/O函数，记得复习哦",
            "chapter": 6,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-7.jpg-290x290"
        },
        {
            "message": "太棒了，你又学会了一节，斌叔先喝杯茶下节课再讲！"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/13-4.gif-300x194",
            "action": "打卡，炫耀下！",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ],
    "13": [
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-10.jpg-580x580"
        },
        {
            "message": "噔噔等灯，瞪瞪等灯，丢丢丢"
        },
        {
            "message": "你挑着担，我牵着你...",
            "action": "师傅你的病越来越重了",
            "chapter": 1,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "额，好了不闹了"
        },
        {
            "message": "我们的Python的基础课程到这里告一段落了"
        },
        {
            "message": "这节课，我们要用学过的知识来完成一个小程序"
        },
        {
            "message": "这个程序是一个问答机器人",
            "action": "好难啊",
            "chapter": 2,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "不难不难，我们只需要让它能够回答简单的问题即可"
        },
        {
            "message": "还可以训练它去记住某个问题和答案，下次你同它对话，它就会回答相应的话语",
            "action": "好呀好呀，等不及了快开始吧",
            "chapter": 3,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "好，那我问你如果让你实现这个机器人程序，你有什么思路么？",
            "action": "额，这个。。。额",
            "chapter": 4,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-11.jpg-400x346"
        },
        {
            "message": "没关系，我们一步一步来"
        },
        {
            "message": "实现这个机器人程序需要用到字典，嵌套循环，判断等知识点"
        },
        {
            "message": "首先我们应该想到用字典去存储机器人的对话"
        },
        {
            "message": "这个字典相等于让机器人有了记忆"
        },
        {
            "message": "然后我们还需要机器人是运作中的，所以我们需要一个循环让机器人能一直响应我们的问题",
            "action": "如果问的问题字典中不存在怎么办呢？",
            "chapter": 5,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "问的好，这就需要用for循环遍历我们的字典"
        },
        {
            "message": "还要用判断来辨别这个问题，在字典中是否已经存在"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-11.jpg-720x689"
        },
        {
            "message": "存在的话，就输出相应的回答"
        },
        {
            "message": "不存在，我们还需要用到raw_input获取输入，来向字典中存入键值对",
            "action": "这就相当于训练机器人",
            "chapter": 6,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "说的对，已经说完了思路，现在来看看我的程序吧"
        },
        {
            "message": "我已经在每一步骤后面都加入了注释"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-11.png-571x867",
            "action": "好多的代码啊",
            "chapter": 7,
            "zuan_number": 1,
            "grow_number": 20
        },
        {
            "message": "这个程序将字典、判断、循环等知识组合在了一起"
        },
        {
            "message": "从前我们都是单一的模块练习，这次要灵活的组合运用起来，忘记的需要回去复习一下啊"
        },
        {
            "message": "友情提示"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/20-12.png-625x144",
            "action": "知道了"
        },
        {
            "message": "看看我和机器人的对话过程，然后自己试着写写吧"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/15-2.png-545x618",
            "action": "完成啦",
            "chapter": 8,
            "zuan_number": 1,
            "grow_number": 30
        },
        {
            "message": "好，给你点个赞"
        },
        {
            "message": "你会发现，有很多知识还没有用到，比如函数等",
            "action": "是的",
            "chapter": 9,
            "zuan_number": 1,
            "grow_number": 10
        },
        {
            "message": "那么你能试着完善一下这个程序么，或者是用学过的知识自己编写一个其他的小程序"
        },
        {
            "message": "相信自己，加油"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/python/0-12.jpg-440x304"
        },
        {
            "message": "Python 的课程到这就结束了，再见👋"
        },
        {
            "img": "https://resource.bcgame-face2face.haorenao.cn/cxy/html/12-4.gif-300x194",
            "action": "打卡，炫耀一下",
            "record": true,
            "zuan_number": 0,
            "grow_number": 0
        }
    ]
}

export default chatdata;