/**
 * 初始化后，与cache内文件进行比对
 * 如果内容匹配的上：指定文件名显示，这样好像不太好
 * {
 *     id: {
 *          title: '',
 *          content: '',
 *          createTime: '',
 *          updateTime: '',
 *     }
 * }
 *
 */
$(() => {
    var exec = require('child_process').exec
    var fs = require('fs')
    const HOST_PATH = '/etc/hosts'

    function cachePath(name) {
        return `${__dirname}/cache/${name}`
    }

    function renderUl() {
        const HOST = readFile(HOST_PATH)
        const data = readHostList()
        const list = Object.keys(data).map(key => {
            return Object.assign({id: key}, data[key])
        })
        $('ul').html(
            list.map(i => {
                return `<li class="${i.current ? 'current' : ''}" data-id="${i.id}">
                    <span>${i.title}</span>
                    <button class="use">u</button>
                    <button class="del">d</button>
                </li>`
            }).join('') || '暂无'
        )
        cpHost()
    }

    function readHostList() {
        const str = readFile(cachePath('host'))
        let json = {}
        try {
            json = JSON.parse(str)
        } catch (e) {

        }
        return json
    }

    function readFile(path) {
        return fs.readFileSync(path).toString()
    }

    function addHost(item) {
        const data = readHostList()
        item.id = item.id || Date.now()
        data[item.id] = {
            id: item.id,
            title: item.title,
            content: item.content,
            current: item.current,
            createTime: item.createTime || Date.now(),
            updateTime: Date.now(),
        }

        fs.writeFileSync(cachePath('host'), JSON.stringify(data, null, 4))
    }

    function delHost(key) {
        const data = readHostList()
        delete data[key]
        fs.writeFileSync(cachePath('host'), JSON.stringify(data, null, 4))
    }

    function useHost(id) {
        const item = getHost(id)
        fs.writeFileSync(HOST_PATH, item.content)
    }

    function getHost(key) {
        return readHostList()[key] || {}
    }

    function cpHost() {
        // 获取所有current,然后复制过去就好了
        const data = readHostList()
        const content = Object.keys(data)
        .map(key => data[key])
        .filter(i => i.current)
        .map(i => i.content)
        .join('\n')

        fs.writeFileSync(HOST_PATH, content)
    }

    renderUl()
    $('.host').html(
        readFile(HOST_PATH)
    )

    $('#app')
    .on('click', '.submit-host', event => {
        const title = $('.host-name').val()
        const content = $('textarea').val()
        const id = $('.submit-host').data('id')
        if (title) {
            addHost({ title, content, id, })
            // $('.add-host').click()
            renderUl()
        }
    })
    .on('click', 'li span', function(){
        const item = getHost($(this).parent().data('id'))
        $('input').val(item.title)
        $('textarea').val(item.content)
        $('.submit-host').data('id', item.id)

        // $(this).parent().addClass('active').siblings().removeClass('active')
    })
    .on('click', '.add-host', () => {
        $('input').val('')
        $('textarea').val('')
        $('.submit-host').data('id', '')
    })
    .on('click', 'li .del', function() {
        delHost($(this).parent().data('id'))
        renderUl()
    })
    .on('click', 'li .use', function() {
        const item = getHost($(this).parent().data('id'))
        item.current = !item.current
        addHost(item)
        renderUl()
    })
})
