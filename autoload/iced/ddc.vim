function! iced#ddc#complete(plugin_name, input, once_method_name) abort
  call iced#complete#candidates(
        \ a:input,
        \ {response -> denops#request(a:plugin_name, a:once_method_name, [response])}
        \ )
endfunction

