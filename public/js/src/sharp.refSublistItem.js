(function($)
{
    $.fn.sharp_refSublistItem=function(options)
    {
        var defauts = { };
        var params = $.extend(defauts, options);

        function refreshSubList($baseRefField, $refSublistField, $datastore)
        {
            var baseRefValue = $baseRefField.find("option:selected").val();

            $refSublistField.disable();
            $refSublistField.clearOptions();

            $datastore.find("optgroup").each(function()
            {
                if($(this).attr("label") == baseRefValue)
                {
                    $refSublistField.enable();
                    $(this).find("option").each(function()
                    {
                        $refSublistField.addOption({
                            value: $(this).val(),
                            text: $(this).text()
                        });
                        $refSublistField.addItem($(this).val());
                    });

                    return false;
                }
            });
        }

        return this.each(function()
        {
            $(this).selectize(params);

            var $datastore = $(this).prev("select[name=" + escapeFieldId($(this).prop("id")) + "_values]");

            var $refSublistField = $(this)[0].selectize;

            var $baseRefField = $("#" + escapeFieldId(params.linked_ref_field));

            $baseRefField.on('change', function()
            {
                refreshSubList($baseRefField, $refSublistField, $datastore);
            });

            refreshSubList($baseRefField, $refSublistField, $datastore);

            // Restore initial value
            if(params.initial_value)
            {
                $refSublistField.setValue(params.initial_value);
            }

        });
    }

}(jQuery));

$(window).load(function() {

    $('.sharp-refSublistItem').each(function()
    {
        createSharpRefSublistItem($(this));
    });

});

function createSharpRefSublistItem($el)
{
    var options = {
        linked_ref_field: $el.data("linked_ref_field"),
        initial_value: $el.data("initial_value")
    };

    $el.sharp_refSublistItem(options);
}

function escapeFieldId(id)
{
    return id.replace( /(:|\.|\[|\]|\~|,)/g, "\\$1" );
}