jQuery.ajax({
    type: "GET",
    url: './data.json',
    success: function (data) {
        main(data);
    },
    error: (e) => {
        console.error(e)
    }
});

let tree;
let JavaScriptNodeId;

function main(wmsData) {
    const layer = wmsData.Capability.Layer;

    console.log(layer);

    console.log(jQuery.jstree.version);

    tree = jQuery("#jstree");

    tree.jstree({
        'plugins': ["checkbox", "wholerow", "contextmenu"],
        'core': {
            "dblclick_toggle": true,
            "state": {
                "checked": false
            },
            'check_callback': true,
            "expand_selected_onload": true,

            // remove icon, dot line
            /*
            "themes": {
                "icons": false,
                "dots": false
            }
            */
            //"multiple": true
        },
        "checkbox": {
            "keep_selected_style": true,
            "three_state": false,
            "whole_node": false,
            "tie_selection": false,
        }
    });

    generateTree(layer, '#');
}

function generateTree(layer, parentNode) {
    if (layer.Layer === undefined) {
        // leaf node
        tree.jstree('create_node',
            parentNode,
            {
                "text": layer.Name,
                "icon": './tree.png',
                "state": {
                    //  selected : false,
                    //  disabled: true
                },
                data: {
                    "layerInfo": layer,
                }
            },
            "last",
            false,
            false,
        );

        return;
    }

    // non leaf node
    const title = layer.Title;

    let opened = false;

    // check if first level
    if (parentNode === '#')
        opened = true;

    let node1 = tree.jstree('create_node',
        parentNode,
        {
            "text": title,
            "state": {
                opened: opened,
            },
            a_attr: {
                class: "no_checkbox"
            }
        },
        "last",
        false,
        false,
    );

    for (let i = 0; i < layer.Layer.length; i++) {
        generateTree(layer.Layer[i], node1);
    }
}

// https://www.jstree.com/api/#/?f=create_node(%5Bpar,%20node,%20pos,%20callback,%20is_loaded%5D

function generateTestTree() {
    let tree = jQuery("#testJstree");

    tree.jstree({
        'plugins': ["checkbox", "wholerow", "contextmenu"],
        'core': {
            "dblclick_toggle": false,
            "state": {
                "checked": false
            },
            'check_callback': true,
            "expand_selected_onload": true,

            // remove icon, dot line
            /*
            "themes": {
                "icons": false,
                "dots": false
            }
            */
            // "multiple": true
        },
        "checkbox": {
            "keep_selected_style": true,
            "three_state": false,
            "whole_node": false,
            "tie_selection": false,
        },
        "contextmenu": {
            items: function ($node) {
               return {
                   "Create" : {
                       "separator_before": false,
                       "separator_after": false,
                       "label": "Rename",
                       "action": function (obj) {
                           console.log(obj)
                       }
                   }
               }
            }
        }
    });

    // https://www.jstree.com/api/#/?f=create_node(%5Bpar,%20node,%20pos,%20callback,%20is_loaded%5D

    let WebNodeId = tree.jstree('create_node',
        // parent node (to create a root node use either "#" (string) or null)
        "#",
        // data for the new node
        {
            "text": "<b>Web</b>",
            "icon": null
        },
        // the index at which to insert the node, "first" and "last" are also supported, default is "last"
        "last",
        // callback
        false,
        false,
    );

    console.log(WebNodeId);

    tree.jstree('create_node',
        WebNodeId,
        {
            "text": "<b>HTML</b>",
        },
        "last",
        false,
        false,
    );

    JavaScriptNodeId = tree.jstree('create_node',
        WebNodeId,
        {
            "text": "<b>JavaScript</b>",
        },
        "last",
        false,
        false,
    );

    tree.jstree('create_node',
        // parent node (to create a root node use either "#" (string) or null)
        "#",
        // data for the new node
        {
            "text": "<b>Mobile</b>",
        },
        // the index at which to insert the node, "first" and "last" are also supported, default is "last"
        "last",
        false,
        false
    );
}

document.getElementById('alertCheckedNodesData').addEventListener('click', () => {
    alertCheckedNodesData();
});

document.getElementById('select').addEventListener('click', () => {
    jQuery("#testJstree").jstree(true).select_node(JavaScriptNodeId);
});

generateTestTree();

function alertCheckedNodesData() {
    const jsonNodes = $('#jstree').jstree(true).get_json('#', {flat: true});

    jsonNodes.forEach(node => {
        if (!node.data.layerInfo)
            return;

        if (!node.state.checked)
            return;

        console.log(node.data.layerInfo);
        alert(JSON.stringify(node.data.layerInfo));
    })
}

