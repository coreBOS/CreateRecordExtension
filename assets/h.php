<?php
echo $argv[1]."\n";
echo hash_file('sha256', $argv[1]);
