$(window).load(function() {

    // ---
    // Manage links on row click in entity list
    // ---
    $("body.sharp-list table .entity-row .entity-data").each(function() {
        if($(this).data("link"))
        {
            $(this).click(function() {
                if($("#entity-list.reorder").length) return;
                window.location = $(this).data("link");
            });
        }
        else
        {
            $(this).parents(".entity-row").addClass("inactive");
        }
    });

    // ---
    // Switch entity list to reorder mode
    // ---
    $("body.sharp-list #sharp-reorder").click(function() {
        $("body").addClass("reorder");
        $("table#entity-list tbody").sortable({
            items: '.entity-row',
            handle: ".reorder-handle",
            axis: "y",
            helper: function(e, tr)
            {
                var $originals = tr.children();
                var $helper = tr.clone();
                $helper.children().each(function(index)
                {
                    // Set helper cell sizes to match the original sizes
                    $(this).width($originals.eq(index).outerWidth());
                });
                return $helper;
            }
        });
    });

    // ---
    // Ajax reorder call and switch back to normal mode
    // ---
    $("body.sharp-list #sharp-reorder-ok").click(function(e) {

        // Out of reorder mode.
        e.preventDefault();
        $("body").removeClass("reorder");

        // Ajax call
        var url = $(this).attr("href");
        var tabIds = [];
        $("#entity-list .entity-row").each(function() {
            tabIds.push($(this).data("entity_id"));
        });

        $.post(url, {
            entities:tabIds,
            _token: getPostToken()
        }, function(data) {
            if(data.err)
            {

            }
        }, "json");
    });


    // ---
    // Show confirm on delete entity click
    // ---
    $("body.sharp-list .sharp-delete").click(function() {
        if(confirm($(this).data("confirm")))
        {
            $("form#" + $(this).data("form")).submit();
        }
    });

    // ---
    // Manage ajax calls for .ajax links
    // ---
    $("body#sharp .ajax").click(function(e) {
        e.preventDefault();
        var link = $(this);
        var url = $(this).attr("href");
        var success = $(this).data("success");
        var failure = $(this).data("failure");
        $.post(url, {
            _token: getPostToken()
        }, function(data) {
            if(data.err)
            {

            }
            else
            {
                window[success](link, data);
            }
        }, "json");
    });

});

function activate($source, jsonData)
{
    $source.parents(".state").removeClass("state-inactive").addClass("state-active");
}

function deactivate($source, jsonData)
{
    $source.parents(".state").removeClass("state-active").addClass("state-inactive");
}

function getPostToken()
{
    return $("#formToken input[name=_token]").val();
};$(window).load(function() {

    $("#sharpform .sharp-field[data-conditional_display]").each(function() {
        manageConditionalDisplay($(this));
    });

});

function manageConditionalDisplay($field)
{
    var cond = $field.data("conditional_display");
    var showFieldIfTrue = cond.charAt(0)!='!';
    var stateFieldName = showFieldIfTrue ? cond : cond.substring(1);
    var stateFieldValue = 1;

    if((valPos = stateFieldName.indexOf(':')) != -1)
    {
        // State field has a specific value (probably a <select> case)
        stateFieldValue = stateFieldName.substring(valPos+1);
        stateFieldName = stateFieldName.substring(0, valPos);

        if((valPos = stateFieldValue.indexOf(',')) != -1)
        {
            // Multiple values
            stateFieldValue = stateFieldValue.split(',');
        }
    }

    var $item = $field.parents(".sharp-list-item");
    if($item.length)
    {
        // List item case: check first if it's template
        if($item.hasClass("template"))
        {
            // Template: skip
            return;
        }
        // We use $= selector to look for input which end of name is [stateFieldName]
        // (with brackets because it's a list)
        $stateField = $item.find(".sharp-field *[name$=\\["+escapeFieldName(stateFieldName)+"\\]]");
    }
    else
    {
        // Normal case, conditional field in form-wide
        $stateField = $("#sharpform").find(".sharp-field *[name="+escapeFieldName(stateFieldName)+"]");
    }

    if($stateField.length)
    {
        if($stateField.is(":checkbox"))
        {
            $stateField.change(function() {
                checkboxShowHide($(this), $field, showFieldIfTrue);
            });

            checkboxShowHide($stateField, $field, showFieldIfTrue);
        }

        else if($stateField.is("select"))
        {
            $stateField.change(function() {
                selectShowHide($(this), stateFieldValue, $field, showFieldIfTrue);
            });

            selectShowHide($stateField, stateFieldValue, $field, showFieldIfTrue);
        }
    }
}

function checkboxShowHide($checkbox, $field, fieldShowOnChecked)
{
    showHideField($field,
        ($checkbox.is(":checked") && fieldShowOnChecked)
            || (!$checkbox.is(":checked") && !fieldShowOnChecked));
}

function selectShowHide($select, value, $field, fieldShowIfSelected)
{
    var values = null;
    if(!$.isArray(value))
    {
        values = [];
        values.push(value);
    }
    else
    {
        values = value;
    }

    show = false;
    for(var i=0; i<values.length; i++)
    {
        value = values[i];

        show = ($select.find('option:selected').val() == value && fieldShowIfSelected)
            || ($select.find('option:selected').val() != value && !fieldShowIfSelected);

        if(show) break;
    }

    showHideField($field, show);
}

function showHideField($field, show)
{
    if(show)
    {
        $field.show();
    }
    else
    {
        $field.hide();
    }
}

function escapeFieldName( fieldName )
{
    return fieldName.replace( /(:|\.|\[|\]|~|\\)/g, "\\$1" );
}